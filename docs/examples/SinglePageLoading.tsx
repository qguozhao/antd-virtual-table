import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';
import { VList, } from '../../src/index';
import 'antd/dist/antd.css';

const generateData = () => {
    const tempDataSource = [];
    for (let i = 0; i < 200; i++) {
        tempDataSource.push({
            uuid: `${i}`,
            company_name1: i % 3 !== 1 ? `aaa${i} 富士山下的你好美` : (
                <>
                    {' '}
                    <Tag>富士山下的你好美富士山下的你</Tag>
                    <Tag>富士山下的你好美富士山下的你</Tag>
                    <Tag>富士山下的你好美富士山下的你</Tag>
                </>
            ),
            company_name2: `aaa${i} company index`,
            company_name3: `aaa${i} company company`,
            company_name4: `aaa${i} company company`,
        });
    }

    return tempDataSource;
};

function SinglePageLoading() {
    const dataSource = generateData()

    const loading = false

    const columns: any = [
        {
            title: '序号',
            dataIndex: 'uuid',
            fixed: 'left',
            width: 100,
        },
        {
            title: '公司1',
            dataIndex: 'company_name1',
            width: 200
        },
        {
            title: '公司2',
            dataIndex: 'company_name2',
            width: 200
        },
        {
            title: '公司3',
            dataIndex: 'company_name3',
            width: 200
        }
    ];

    const components = useMemo(() => VList({
        rowKeyList: dataSource.map((cv) => cv.uuid)
    }), [dataSource])

    return (
        <>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                loading={loading}
                scroll={{ y: 500, x: '100%' }}
                rowKey="uuid"
                components={components}
            />
        </>
    );
}

export default SinglePageLoading
