import { useState } from 'react'

const PersonForm = ({ submitForm }) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    submitForm({ name, number });
    setName('');
    setNumber('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        number: <input value={number} onChange={e => setNumber(e.target.value)} />
      </div>
      <button type="submit">add</button>
    </form>
  );
};

export default PersonForm