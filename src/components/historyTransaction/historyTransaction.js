import React from "react";
import "./historyTransaction.css";

const historyTransaction = ({history}) => {

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
          {history.map(item => {
            return (
              <tr className="table-row-body">
                <td className="size-270 date-cell">{item.date}</td>
                <td className="size-170 type-cell">{item.kindOfTransaction}</td>
                <td className="size-120 amount-cell">{item.value}</td>
                <td className="size-130">{item.saldoAfter}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default historyTransaction;
