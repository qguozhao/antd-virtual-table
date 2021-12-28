# antd-virtual-table

>

NPM 版本：https://www.npmjs.com/package/antd-virtual-table

实现 antd-table 的虚拟列表，支持非固定行高、动态改变行高 （antd-table 所有属性均正常可用，如筛选、排序等）

## Install

```bash
npm install --save antd-virtual-table
```

## Usage

```tsx
import * as React from 'react'
import { VList } from 'antd-virtual-table'
import { Table } from 'antd'

function Example(): JSX.Element {
    const dataSource = []
    const columns = []
    const rowKeyList = useMemo(
        () => dataSource?.map((cv) => cv?.[rest.rowKey]),
        [dataSource, rest.rowKey]
    )
    const components = useMemo(() => {
        if (virtualTable) {
            return {
                ..._components,
                ...VList({ rowKeyList }),
            }
        }
        return _components
    }, [_components, virtualTable])

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            components={components}
            rowKey={'uuid'}
        />
    )
}
```
