import React from 'react';

type FormValues = {
  M3_1: number | '';
  M3_2: number | '';
  M3_3: number | '';
  M3_4: number | '';
  M3_5: number | '';
  M3_6: number | '';
  M5_1: number | '';
  M5_2: number | '';
  M5_3: number | '';
  M5_4: number | '';
  M5_5: number | '';
  M5_6: number | '';
  near3klFilling: number | '';
  near10klFilling: number | '';
  [key: string]: number | ''; // Allow dynamic keys
};

const MyForm: React.FC = () => {
  const [formValues, setFormValues] = React.useState<FormValues>({
    M3_1: '',
    M3_2: '',
    M3_3: '',
    M3_4: '',
    M3_5: '',
    M3_6: '',
    M5_1: '',
    M5_2: '',
    M5_3: '',
    M5_4: '',
    M5_5: '',
    M5_6: '',
    near3klFilling: '',
    near10klFilling: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? '' : parseFloat(value);
    setFormValues({
      ...formValues,
      [name]: numericValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formValues);
    // Add form submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="h-full w-screen p-4 mx-auto">
      <div className='text-black'>
        <label>DAILY READINGS</label>
      </div><br></br>
      <div className="grid grid-cols-1">
        {Object.keys(formValues).map((field) => (
          <div key={field} className="flex flex-row items-center mb-4">
            <div className='text-left w-1/4'>
              <label htmlFor={field} className="text-sm font-medium text-gray-700">
                {field.replace('_', ' ')}
              </label>
            </div>
            <div className="flex flex-wrap w-3/4">
              {[...Array(4)].map((_, idx) => (
                <div key={`${field}_${idx}`} className="w-28 mr-2">
                  <input
                    id={`${field}_${idx}`}
                    name={`${field}_${idx}`}
                    type="number"
                    step="any"
                    value={formValues[`${field}_${idx}`] || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="mt-8 w-20 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
};

export default MyForm;
