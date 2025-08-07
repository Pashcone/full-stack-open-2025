const PersonList = ({ people, deletePerson }) => {

  const handleDelete = (personId) => {
    deletePerson(personId);
  };

  return people.map((p) => (
    <p key={p.id}>
      {p.name} {p.number} <button onClick={() => {handleDelete(p)}}>delete</button>
    </p>
  ));
};

export default PersonList;
