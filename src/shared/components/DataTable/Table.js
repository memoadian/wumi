import React, { useMemo } from 'react'
import { useTable, useSortBy, useGlobalFilter } from 'react-table'
import GlobalFilter from './GlobalFilter'

const Table = props => {
    const dataHeaders = props.dataHeaders
    const dataBody = props.dataBody

    const columns = useMemo(() => dataHeaders, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
        selectedFlatRows
    } = useTable({
        columns: columns,
        data: dataBody
    },
    useGlobalFilter,
    useSortBy)

    const { globalFilter } = state

    return (
        <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <table className="table is-fullwidth" {...getTableProps()}>
                <thead>
                {headerGroups.map(head => (
                    <tr {...head.getHeaderGroupProps()}>
                        {head.headers.map((column) => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                    {column.isSorted ? (column.isSortedDesc ? '<' : '>') : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        rows.map((row) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps({
                                    onClick: e => props.onRowClicked && props.onRowClicked(row.cells[0].row.original, e)
                                })}>
                                    {
                                        row.cells.map(cell => 
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table
