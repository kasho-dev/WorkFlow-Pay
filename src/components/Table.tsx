import React from 'react';

interface TableProps {
  headers: string[];
  data: (string | number)[][];
  className?: string;
}

const Table: React.FC<TableProps> = ({ headers, data, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-card">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-white">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-card border-b border-gray-700 hover:bg-gray-700">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 text-white">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 