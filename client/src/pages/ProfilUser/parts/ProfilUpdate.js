import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosconfig';
import { Link } from 'react-router-dom';
import './ProfilUpdate.css';
import { useTranslation } from "react-i18next";
import LinkAccountInput from '../../../components/LinkAccountInput';
import { updateUser, useAuthState, useAuthDispatch } from '../../../context/Auth';

export default function ProfilUpdate() {
    const firstname = useRef();
    const lastname = useRef();
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const confirmPassword= useRef();
    const navigate = useNavigate();
    const dispatch = useAuthDispatch();
    const [errors, setErrors] = useState([]);
    const [changePass, setChangePass] = useState(false);
    const [games, setGames] = useState([]);
    const {user, config} = useAuthState();
    const { t } = useTranslation();

    useEffect(() => {
        getGames();
    },[])

    const getGames = async () => {
        const gameInfo = await axios.get(process.env.REACT_APP_API_URL+'/games', config);
        setGames(gameInfo.data.games);
    }

    const update = async (e) => {
        e.preventDefault();
        const data = {
          firstname: firstname.current.value, 
          lastname: lastname.current.value, 
          username: username.current.value, 
          email: email.current.value, 
          id: user._id,
          password: password.current.value,
          confirmPassword: confirmPassword.current.value,
        };

        const result = await axios.post(process.env.REACT_APP_API_URL+'/users/update', data, config);
        if (result.data.success) {
          updateUser(dispatch, {user: result.data.user});
          navigate("/profil");
        } else {
          setErrors(result.data.errors)
        }
    }

    return (
        <div className="edit-profil-container">
        {user ? (
          <div className="edit-body">
           {errors.length > 0 
            ? errors.map((err, index) => <p key={index}>{err.msg}</p>)
            : ''
          }
          <section className='edit-formulaire'>
          <div className="edit-separator">
              <h2>informations</h2>
              <div className="separator"></div>
          </div>
            <form onSubmit={update}>
              <div className='edit-first-line'>
                <div className='edit-group-duo'>
                  <label htmlFor="firstname">{t('modifUser.firstname')}</label>
                  <input type="text" placeholder={t('modifUser.firstname')} name='firstname' className='edit-firstname' defaultValue={user.firstname} ref={firstname} />
                </div>
                <div className='edit-group-duo'>
                  <label htmlFor="lastname">{t('modifUser.lastname')}</label>
                  <input type="text" placeholder={t('modifUser.lastname')} name='lastname' className='edit-lastname' defaultValue={user.lastname} ref={lastname} />
                </div>
              </div>
              <div className='edit-group'>
                <label htmlFor="email">{t('modifUser.email')}</label>
                <input type="text" placeholder={t('modifUser.email')} name='email' className='edit-email' defaultValue={user.email} ref={email} />
              </div>
              <div className='edit-group'>
                <label htmlFor="pseudo">{t('modifUser.username')}</label>
                <input type="text" placeholder={t('modifUser.username')} name='pseudo' className='edit-username' defaultValue={user.username} ref={username} />
              </div>
    
              <div className='edit-password-group' style={{display: changePass ? 'block' : 'none'}}>
                <label htmlFor="password">{t('modifUser.new_password')}</label>
                <input type="password" placeholder={t('modifUser.new_password')} name='password' className='edit-username' ref={password} />
              </div>
              <div className='edit-password-group' style={{display: changePass ? 'block' : 'none'}}>
                <label htmlFor="confirmPassword">{t('modifUser.confirm_password')}</label>
                <input type="password" placeholder={t('modifUser.confirm_password')} name='confirmPassword' className='edit-username' ref={confirmPassword} />
              </div>
    
              <div className='edit-button'>
                <input type="button" className='edit-mdp' value={t('modifUser.update_password')} onClick={() => setChangePass(!changePass)}/>
                <input type="submit" className='edit-submit' value={t('modifUser.commit_change')}/>
              </div>
            </form>
          </section>
    
          <section className='edit-pseudo'>
          <div className="edit-separator">
              <h2>pseudo</h2>
              {/* {data.currentMatch && data.currentMatch.participants && !currentBet ? <button onClick={() => setBetPanel(true)}>Make a bet</button> : <button style={{cursor: "not-allowed"}} disabled>Make a bet</button>} */}
              {/* BONUS */}
              {/* <p>ADD</p> */}
              <div className="separator"></div>
            </div>
            <div className="gameGroup">
              {games.map((game,index)=>(
                <>
                  {game.slug === 'league-of-legends' && <LinkAccountInput key={index} data={game} available={true} linked_list={user.linked_account} user_id={user._id}/>}
                </>
              ))}
            </div>
          </section>
    
          <Link to="/profil">Revenir au profil</Link>
          <br />
          </div>
        ): ''}
      </div>
    )
}