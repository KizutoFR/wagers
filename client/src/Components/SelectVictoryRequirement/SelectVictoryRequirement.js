import React, {useState, useRef} from 'react';
import { VICTORY_REQUIREMENTS } from '../../utils/config.json'
import { FaCaretDown } from 'react-icons/fa';
import './SelectVictoryRequirement.css'

export default function SelectVictoryRequirement({list, addToList, setStep, step}) {
    const [selectedRequirement, setSelectedRequirement] = useState(null);
    const requirementValue = useRef();

    const handleRequirementSelection = (event) => {
        const identifier = event.target.value;
        if(identifier !== 0) {
            const requirement = VICTORY_REQUIREMENTS.find(elem => elem.identifier === identifier);
            setSelectedRequirement(requirement);
        }
    }

    const handleSelectOption = () => {
        if((selectedRequirement && !selectedRequirement.params) || (selectedRequirement && requirementValue.current.value !== "")) {
            addToList({identifier: selectedRequirement.identifier, figure: selectedRequirement.figure, value: selectedRequirement.params ? requirementValue.current.value : true, label: selectedRequirement.label})
            setStep(step + 1);
        }
    }

    return (
        <div>
            <div id="betpanel-select">
                <FaCaretDown className='icon' />
                <select onChange={handleRequirementSelection}>
                    <option value="0">Select an option</option>
                    {VICTORY_REQUIREMENTS.map((requirement, index) => (
                        list.find(elem => elem.identifier === requirement.identifier) === undefined ? <option key={index} value={requirement.identifier}>{requirement.label}</option> : ''
                    ))}
                </select>
            </div>
            { selectedRequirement && selectedRequirement.params ? <input id="betpanel-input" ref={requirementValue} type={selectedRequirement.type} placeholder='Enter value here' /> : '' }
            <button className='betpanel-next' onClick={handleSelectOption} style={{marginTop: "60px"}}>NEXT STEP</button>
        </div>
    )
}