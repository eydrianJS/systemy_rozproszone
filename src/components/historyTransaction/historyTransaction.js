import React from 'react';
import './historyTransaction.css';

const historyTransaction = ({history}) => {
    const {date, type, ammount, accountBalance} = history;
    
    return (
        <div>
            <table className="table-container">
                <thead className="table-header">
                    <tr className="table-row-header">
                        <th className="size-270">Data: </th>
                        <th className="size-170">Rodzaj operacji</th>
                        <th className="size-120">Kwota operacji</th>
                        <th className="size-130">Saldo</th>
                    </tr>
                </thead>
                <tbody className="table-header">
                    <tr className="table-row-body">
                        <td className="size-270 date-cell">Data</td>
                        <td className="size-170 type-cell">Rodzaj operacji</td>
                        <td className="size-120 amount-cell">Kwota operacji</td>
                        <td className="size-130">Saldo</td>
                    </tr>
                    
                </tbody>
            </table>
        </div>
    )
}

export default historyTransaction;