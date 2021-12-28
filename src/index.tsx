import { throttle } from 'lodash-es'
import React, {
    useRef,
    useEffect,
    useContext,
    createContext,
    useState,
    useMemo
} from 'react'

const ScrollContext = createContext({
    renderLen: 1,
    start: 0,
})

function VTable(props, otherParams): JSX.Element {
    const { style, children, ...rest } = props
    const { width, ...rest_style } = style
    const { rowKeyList } = otherParams ?? {}
    // 默认行高
    const rowHeight = 50
    const originData = {}
    // 行索引与行高组成map对象
    const [rowHeightMap, setRowHeightMap] = useState(originData)
    for (const index of rowKeyList) {
        originData[index] = rowHeight
    }
    // 记录行高累加高度
    const rowHeightSum: number[] = []
    let currowHeightSum = 0
    for (const index of rowKeyList) {
        currowHeightSum += rowHeightMap[index]
        rowHeightSum.push(currowHeightSum)
    }
    // 渲染的第一条数据的索引
    let start = 0
    // 二分查找:第一个累加高度大于scrollTop的数据索引
    const binarySearch = (array: number[], value: number) => {
        let left = 0
        let right = array.length - 1
        while (left <= right) {
            const middle = left + Math.floor((right - left) / 2)
            if (array[middle] >= value) right = middle - 1
            else left = middle + 1
        }
        return left
    }
    // 当前ScrollTop值
    const [curScrollTop, setCurScrollTop] = useState<number>(0)
    start = binarySearch(rowHeightSum, curScrollTop)
    // 初始渲染条数
    const [renderLen, setDefaultRenderLen] = useState(0)
    const wrap_tableRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef<HTMLTableElement>(null)

    // 计算当前屏幕能展示数据条数
    useEffect(() => {
        const parentHeight = (wrap_tableRef.current?.parentNode as HTMLElement)?.offsetHeight
        setDefaultRenderLen(Math.ceil(parentHeight / rowHeight))
    }, [rowHeight])

    // 偏移量,向上滚动的动画效果
    let offsetStart = rowHeightSum[start]
        ? rowHeightMap[start] - (rowHeightSum[start] - curScrollTop)
        : 0

    const result = useMemo(() => rowKeyList.length - renderLen - start, [
        renderLen,
        rowKeyList,
        start
    ])
    // 滚动到最底部时，偏移量重置为0
    if (result <= 0) {
        offsetStart = 0
    }

    // virtuallist总高度
    const tableHeight = rowHeightSum[rowKeyList.length - 1] || rowHeight * rowKeyList.length
    useEffect(() => {
        const curRowHeightMap: any = {}
        let n = 1
        while (n <= renderLen) {
            const index = rowKeyList.indexOf(
                tableRef.current?.getElementsByTagName('tr')[n]?.getAttribute('data-row-key')
            )
            if (index > -1) {
                // 记录页面上存在的tr行高
                curRowHeightMap[index] = tableRef.current?.getElementsByTagName('tr')[n]?.offsetHeight
            }
            n += 1
        }
        // 更新记录行高的map对象
        setRowHeightMap((prevState: any) => Object.assign(prevState, curRowHeightMap))
    }, [renderLen, curScrollTop, rowKeyList])

    useEffect(() => {
        const throttleScroll = throttle((e) => {
            const scrollTop: number = e?.target?.scrollTop ?? 0
            setCurScrollTop(scrollTop)
        }, 16)
        const ref = wrap_tableRef?.current?.parentNode as HTMLElement
        if (ref) {
            ref.addEventListener('scroll', throttleScroll, {
                // 防止调用事件监听器：为了提高滚动性能
                passive: true,
            })
        }
        return () => {
            ref.removeEventListener('scroll', throttleScroll)
        }
    }, [wrap_tableRef])

    return (
        <div
            className="virtuallist"
            ref={wrap_tableRef}
            style={{
                width: '100%',
                position: 'relative',
                height: tableHeight,
                boxSizing: 'border-box'
            }}
        >
            <ScrollContext.Provider
                value={{
                    start,
                    renderLen,
                }}
            >
                <table
                    {...rest}
                    ref={tableRef}
                    style={{
                        ...rest_style,
                        width,
                        position: 'sticky',
                        top: 0,
                        transform: `translateY(-${offsetStart}px)`
                    }}
                >
                    {children}
                </table>
            </ScrollContext.Provider>
        </div>
    )
}

function VWrapper(props: any): JSX.Element {
    const { children, ...restProps } = props
    const { renderLen, start } = useContext(ScrollContext)
    const contents = children[1]
    const tempNode = useMemo(() => {
        if (Array.isArray(contents) && contents.length) {
            return [children[0], contents.slice(start, start + renderLen)]
        }
        return children
    }, [children, contents, renderLen, start])
    return <tbody {...restProps}>{tempNode}</tbody>
}

const transformTable = (tempObj: any) => (props: any) => VTable(props, tempObj)
export function VList(props: { rowKeyList?: string[] }): any {
    const TableComponent = transformTable({
        rowKeyList: props.rowKeyList,
    })
    return {
        table: TableComponent,
        body: {
            wrapper: VWrapper,
        }
    }
}
