import React from 'react'

function Table({countries}) {
    return (
        <div className='table'>
        {/*  destructuring the data */}
            {countries.map(({country, cases}) => (
                <tr>
                    <td>{country}</td>
                    <td><strong>{cases}</strong></td>
                </tr>
            ))}
        </div>
    )
}

export default Table
