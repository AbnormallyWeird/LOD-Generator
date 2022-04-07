import React, {useState, createContext} from 'react';

export const PersonContext = createContext();

export const PeopleProvider = props => {
    const [people, setPeople] = useState([
        {
            index: 1,
            value: "John",
            done: false,
            paid: false
        }
    ]);
    return (
        <PersonContext.Provider value={[people, setPeople]}>
            {props.children}
        </PersonContext.Provider>
    );
}