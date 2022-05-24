import React, { useEffect, useState } from "react"
import { useTranslation } from 'react-i18next';
import { Language } from '../../utils/language';
import './Lang.css'

export default function Lang(){
    const { i18n } = useTranslation();
    const [lang, setLang] = useState(localStorage.wagers_lang || i18n.language);

    const changeLanguage = (event) => {
        let language = event.target.value;
        switch (language) {
            case Language.EN:
                setLang(Language.EN);
                localStorage.setItem('wagers_lang', Language.EN)
                i18n.changeLanguage(Language.EN);
                break;
            case Language.FR:
            default:
                setLang(Language.FR);
                localStorage.setItem('wagers_lang', Language.FR)
                i18n.changeLanguage(Language.FR);
                break;
        }
    }

    useEffect(() => {
        setLang(localStorage.wagers_lang || i18n.language);
        i18n.changeLanguage(localStorage.wagers_lang || i18n.language);
    }, [])

    return (
        <div>
            <div className="Lang">
                <select value={lang} id="language" name="language" onChange={changeLanguage}>
                    <option value={Language.FR}>FR</option>
                    <option value={Language.EN}>EN</option>
                </select>
            </div>
        </div>
    )
}