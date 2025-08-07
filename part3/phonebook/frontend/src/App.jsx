import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonList from "./components/PersonList";
import PersonForm from "./components/PersonForm";
import personsService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState({
    text: null,
    color: "red" | "green",
  });

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  useEffect(() => {
    setFilteredPersons(getFilteredPersons(filter, persons));
    console.log("filter", filter, persons);
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
        changeMessage(`Added ${returnedPerson.name}`, "green");
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
      personsService
        .deletePerson(person.id)
        .then((response) => {
          console.log("response", response);
          setPersons(persons.filter((p) => p.id !== person.id));
        })
        .catch(() => {
          changeMessage(
            `Information of ${person.name} has already been removed from server`,
            "red"
          );
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

  function changeMessage(message, color) {
    setNotificationMessage({ color: color, text: message });
    setTimeout(() => {
      setNotificationMessage({ ...notificationMessage, text: null });
    }, 5000);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter onChangeHandle={handleChangeFilter} />
      <h2>add a new</h2>
      <PersonForm submitForm={handleSubmit} />
      <h2>Numbers</h2>
      <PersonList deletePerson={deletePerson} people={filteredPersons} />
    </div>
  );
};

export default App;
