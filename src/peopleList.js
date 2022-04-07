import React, {useContext} from "react";
import {PersonContext} from "./peopleContext";
import LODSignups from "./lodSignup";

const PeopleList = () => {
    const [people, setPeople] = useContext(PersonContext);

    return(
        <div>
            {people.map(person => (
                <div>
                    <li>{person.value}</li>
                    <lodSignup 
                        key={person.key}
                        item={person.item}
                    />
                </div>
            ))}
        </div>
    )
}

export default PeopleList;