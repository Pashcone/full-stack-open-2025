import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [mostVoted, setMostVoted] = useState(-1);
  const [votes, setVotes] = useState([]);

  const nextAnecdote = () => {
    const randomNumber = Math.floor(Math.random() * (anecdotes.length - 1));
    if (randomNumber === selected) {
      return nextAnecdote();
    }
    setSelected(randomNumber);
  };

  const voteAnecdote = () => {
    const anecdoteIndex = selected;
    votes[anecdoteIndex] = (votes[anecdoteIndex] || 0) + 1;

    if (votes[anecdoteIndex] > (votes[mostVoted] || 0)) {
      setMostVoted(anecdoteIndex);
    }
    setVotes([...votes]);
  };

  const AnecdoteOfTheDay = () => {
    return (
      <div>
        <h1>Anecdote of the day</h1>
        <p>{anecdotes[selected]}</p>
        <button onClick={voteAnecdote}>vote</button>
        <button onClick={nextAnecdote}>next anecdote</button>
      </div>
    );
  };

  const MostVotedAnecdote = () => {
    if (anecdotes[mostVoted]) {
      return (
        <div>
          <h1>Anecdote with the most votes</h1>
          <p>{anecdotes[mostVoted]}</p>
          <p>has {votes[mostVoted] || 0} votes</p>
        </div>
      );
    }
  }

    return (
      <div>
        <AnecdoteOfTheDay />
        <MostVotedAnecdote />
      </div>
    );
  };

export default App;
