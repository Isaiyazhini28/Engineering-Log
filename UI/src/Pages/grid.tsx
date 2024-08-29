import React, { useState } from 'react';

interface Data {
  date: Date;
  M3_1: number;
  M3_2: number;
  M3_3: number;
  M3_4: number;
  M3_5: number;
  M3_6: number;
  M5_1: number;
  M5_2: number;
  M5_3: number;
  M5_4: number;
  M5_5: number;
  M5_6: number;
  near3klFilling: number;
  near10klFilling: number;
}

const DynamicGrid: React.FC = () => {
  const [data, setData] = useState<Data[]>([
   
  ]);

  const [M3_1, setM3_1] = useState<number | ''>('');
  const [M3_2, setM3_2] = useState<number | ''>('');
  const [M3_3, setM3_3] = useState<number | ''>('');
  const [M3_4, setM3_4] = useState<number | ''>('');
  const [M3_5, setM3_5] = useState<number | ''>('');
  const [M3_6, setM3_6] = useState<number | ''>('');
  const [M5_1, setM5_1] = useState<number | ''>('');
  const [M5_2, setM5_2] = useState<number | ''>('');
  const [M5_3, setM5_3] = useState<number | ''>('');
  const [M5_4, setM5_4] = useState<number | ''>('');
  const [M5_5, setM5_5] = useState<number | ''>('');
  const [M5_6, setM5_6] = useState<number | ''>('');
  const [near3klFilling, setNear3klFilling] = useState<number | ''>('');
  const [near10klFilling, setNear10klFilling] = useState<number | ''>('');
  

  const handleAddData = () => {
    if (M3_1 !== '' && M3_2 !== '' && M3_3 !== '' && M3_4 !== '' && M3_5 !== '' && M3_6 !== '' && M5_1 !== '' && M5_2 !== '' && M5_3 !== '' && M5_4 !== '' && M5_5 !== '' && M5_6 !== '' && near3klFilling !== '' && near10klFilling !== '') {
      const newData: Data = {
        date: new Date(),
        M3_1: parseFloat(M3_1.toString()),
        M3_2: parseFloat(M3_2.toString()),
        M3_3: parseFloat(M3_3.toString()),
        M3_4: parseFloat(M3_4.toString()),
        M3_5: parseFloat(M3_5.toString()),
        M3_6: parseFloat(M3_6.toString()),
        M5_1: parseFloat(M5_1.toString()),
        M5_2: parseFloat(M5_2.toString()),
        M5_3: parseFloat(M5_3.toString()),
        M5_4: parseFloat(M5_4.toString()),
        M5_5: parseFloat(M5_5.toString()),
        M5_6: parseFloat(M5_6.toString()),
        near3klFilling: parseFloat(near3klFilling.toString()),
        near10klFilling: parseFloat(near10klFilling.toString()),
      };
      setData([...data, newData]);
      
      setM3_1('');
      setM3_2('');
      setM3_3('');
      setM3_4('');
      setM3_5('');
      setM3_6('');
      setM5_1('');
      setM5_2('');
      setM5_3('');
      setM5_4('');
      setM5_5('');
      setM5_6('');
      setNear3klFilling('');
      setNear10klFilling('');
    }
  };

  return (
    <div>
      <div className="mb-4">
      <input
          type="date"
          value={Date}
          onChange={(e) => setM3_2(parseFloat(e.target.value))}
          placeholder="date"
          step="0.01"
          className="border p-2 mr-2"
          />
        <input
          type="number"
          value={M3_1}
          onChange={(e) => setM3_1(parseFloat(e.target.value))}
          placeholder="M3-1"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={M3_2}
          onChange={(e) => setM3_2(parseFloat(e.target.value))}
          placeholder="M3-2"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={M3_3}
          onChange={(e) => setM3_3(parseFloat(e.target.value))}
          placeholder="M3-3"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={M3_4}
          onChange={(e) => setM3_4(parseFloat(e.target.value))}
          placeholder="M3-4"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={M3_5}
          onChange={(e) => setM3_5(parseFloat(e.target.value))}
          placeholder="M3-5"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={M3_6}
          onChange={(e) => setM3_6(parseFloat(e.target.value))}
          placeholder="M3-6"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={M5_1}
          onChange={(e) => setM5_1(parseFloat(e.target.value))}
          placeholder="M5-1"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={M5_2}
          onChange={(e) => setM5_2(parseFloat(e.target.value))}
          placeholder="M5-2"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={M5_3}
          onChange={(e) => setM5_3(parseFloat(e.target.value))}
          placeholder="M5-3"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={M5_4}
          onChange={(e) => setM5_4(parseFloat(e.target.value))}
          placeholder="M5-4"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={M5_5}
          onChange={(e) => setM5_5(parseFloat(e.target.value))}
          placeholder="M5-5"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={M5_6}
          onChange={(e) => setM5_6(parseFloat(e.target.value))}
          placeholder="M5-6"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={near3klFilling}
          onChange={(e) => setNear3klFilling(parseFloat(e.target.value))}
          placeholder="Near 3KL filling"
          step="0.01"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={near10klFilling}
          onChange={(e) => setNear10klFilling(parseFloat(e.target.value))}
          placeholder="Near 10KL filling"
          step="0.01"
          className="border p-2 mr-2"
        />
        <button
          onClick={handleAddData}
          className="bg-blue-500 text-white p-2"
        >
          Add Data
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-black border border-gray-200">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b bg-black border">Date</th>
              <th className="py-2 px-4 border-b bg-black border">M3-1</th>
              <th className="py-2 px-4 border-b bg-black border">M3-2</th>
              <th className="py-2 px-4 border-b bg-black border">M3-3</th>
              <th className="py-2 px-4 border-b bg-black border">M3-4</th>
              <th className="py-2 px-4 border-b bg-black border">M3-5</th>
              <th className="py-2 px-4 border-b bg-black border">M3-6</th>
              <th className="py-2 px-4 border-b bg-black border">M5-1</th>
              <th className="py-2 px-4 border-b bg-black border">M5-2</th>
              <th className="py-2 px-4 border-b bg-black border">M5-3</th>
              <th className="py-2 px-4 border-b bg-black border">M5-4</th>
              <th className="py-2 px-4 border-b bg-black border">M5-5</th>
              <th className="py-2 px-4 border-b bg-black border">M5-6</th>
              <th className="py-2 px-4 border-b bg-black border">Near 3KL filling</th>
              <th className="py-2 px-4 border-b bg-black border">Near 10KL filling</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b bg-black border">{item.date.toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M3_1}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M3_2}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M3_3}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M3_4}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M3_5}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M3_6}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M5_1}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M5_2}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M5_3}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M5_4}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M5_5}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.M5_6}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.near3klFilling}</td>
                <td className="py-2 px-4 border-b bg-black border">{item.near10klFilling}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicGrid;
