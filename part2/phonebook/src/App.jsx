import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonList from "./components/PersonList";
import PersonForm from "./components/PersonForm";
import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  useEffect(() => {
    setFilteredPersons(getFilteredPersons(filter, persons));
  }, [filter, persons]);

  const handleSubmit = (newPerson) => {
    addPerson(newPerson);
  };

  const addPerson = (newNumber) => {
    const exists = persons.find((p) => p.name === newNumber.name);
    if (exists) {
      const confirmUpdate = window.confirm(
        `${exists.name} is already added to phonebook, replace the old number with a new one?`
      );
      if (confirmUpdate) updatePerson(exists.id, newNumber);
      return;
    } else {
      const personObject = {
        name: newNumber.name,
        number: newNumber.number,
      };

      personsService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
      });
    }
  };

  const updatePerson = (personId, newPerson) => {
    personsService.update(personId, newPerson).then((response) => {
      const newPersons = persons.map((p) => {
        if (p.id === response.id) return { ...p, number: response.number };
        return p;
      });
      console.log(newPersons);
      setPersons(newPersons);
    });
  };

  const deletePerson = (person) => {
    const confirmDelete = window.confirm(`Delete ${person.name}?`);
    if (confirmDelete)
      personsService.deletePerson(person.id).then((response) => {
        console.log("response", response);
        setPersons(persons.filter((p) => p.id !== response.id));
      });
  };

  const handleChangeFilter = (event) => {
    setFilter(event.target.value);
  };

  function getFilteredPersons(filterString, personsArray) {
    return filterString.length
      ? personsArray.filter((person) =>
          person.name.toLowerCase().includes(filterString.toLowerCase())
        )
      : personsArray;
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChangeHandle={handleChangeFilter} />
      <h2>add a new</h2>
      <PersonForm submitForm={handleSubmit} />
      <h2>Numbers</h2>
      <PersonList deletePerson={deletePerson} people={filteredPersons} />
    </div>
  );
};

export default App;
