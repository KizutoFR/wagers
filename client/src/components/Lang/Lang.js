import React, { useState } from "react"
import { useTranslation } from 'react-i18next';
import { Language } from '../../utils/Language.json';

export default function Lang(){
    const { i18n } = useTranslation();
    const [lang, setLang] = useState(i18n.language);

    const changeLanguage = (event) => {
        let language = event.target.value;
        switch (language) {
            case Language.EN:
                setLang(Language.EN);
                i18n.changeLanguage(Language.EN);
                break;
            case Language.FR:
            default:
                setLang(Language.FR);
                i18n.changeLanguage(Language.FR);
                break;
        }
    }

    return (
        <div>
            <div>
                <select value={lang} name="language" onChange={changeLanguage}>
                    <option value={Language.FR}>FR</option>
                    <option value={Language.EN}>EN</option>
                </select>
            </div>
        </div>
    )
}