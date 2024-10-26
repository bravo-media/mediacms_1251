import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { PageActions, MediaPageActions, PlaylistPageActions } from '../../utils/actions/';
import { MediaPageStore, PlaylistPageStore } from '../../utils/stores/';
import { addClassname, removeClassname } from '../../utils/helpers/';

import './PlaylistForm.scss';

export function PlaylistCreationForm(props) {
  const nameRef = useRef(null);
  const nameInputRef = useRef(null);

  const descriptionRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const nowDateTime = new Date();

  const [id, setId] = useState(props.id || null);
  const [title, setTitle] = useState(props.id ? PlaylistPageStore.get('title') : '');
  const [start_date, setStartDate] = useState(props.id ? PlaylistPageStore.get('start_date') ?  PlaylistPageStore.get('start_date') : nowDateTime.toISOString() : nowDateTime.toISOString());
  const [end_date, setEndDate] = useState(props.id ? PlaylistPageStore.get('end_date')  ?  PlaylistPageStore.get('end_date') : nowDateTime.toISOString() : nowDateTime.toISOString());
  const [start_time, setStartTime] = useState(props.id ? PlaylistPageStore.get('start_time')  ?  PlaylistPageStore.get('start_time') : nowDateTime.toISOString() : nowDateTime.toISOString());
  const [end_time, setEndTime] = useState(props.id ? PlaylistPageStore.get('end_time')  ?  PlaylistPageStore.get('end_time') : nowDateTime.toISOString() : nowDateTime.toISOString());
  const [playlist_play_type, setPlaylist_play_type] = useState(props.id ? PlaylistPageStore.get('playlist_play_type')  ?  PlaylistPageStore.get('playlist_play_type') : 'normal' : 'normal');

  const [description, setDescription] = useState(props.id ? PlaylistPageStore.get('description') : '');
  const [descriptionLineHeight, setDescriptionLineHeight] = useState(-1);
  /*const [ selectedPrivacy, setSelectedPrivacy ] = useState( 'public' );*/

  function onFocusDescription() {
    addClassname(descriptionRef.current, 'focused');
  }
  function onBlurDescription() {
    removeClassname(descriptionRef.current, 'focused');
  }
  function onChangePlaylistNameInput() {
    removeClassname(nameRef.current, 'invalid');
  }
  function onFocusPlaylistNameInput() {
    addClassname(nameRef.current, 'focused');
  }
  function onBlurPlaylistNameInput() {
    removeClassname(nameRef.current, 'focused');
  }

  function onChangeTitle() {
    setTitle(nameInputRef.current.value);
  }

  /*function onPrivacyChoose(e){
    setSelectedPrivacy(e.currentTarget.value);
  }*/

  function onChangeDescription() {
    descriptionInputRef.current.style.height = '';

    const contentHeight = descriptionInputRef.current.scrollHeight - 2;
    const contentLineHeight =
      0 < descriptionLineHeight
        ? descriptionLineHeight
        : parseFloat(window.getComputedStyle(descriptionInputRef.current).lineHeight);

    descriptionInputRef.current.style.height =
      3 + Math.max(21, contentLineHeight * Math.floor(contentHeight / contentLineHeight)) + 'px';

    setDescriptionLineHeight(contentLineHeight);
    setDescription(descriptionInputRef.current.value);
  }

  function onClickPlaylistCreate() {
    let title = nameInputRef.current.value.trim();

    if ('' !== title) {
      let description = descriptionInputRef.current.value.trim();

      if (id) {
        PlaylistPageActions.updatePlaylist({
          title: title,
          description: description,
          playlist_play_type: playlist_play_type,
          start_date : start_date ? start_date :nowDateTime,
          end_date : end_date ? end_date :nowDateTime,
          start_time : start_time ? start_time :nowDateTime,
          end_time : end_time ? end_time :nowDateTime,
          // privacy: selectedPrivacy,
        });
      } else {
        MediaPageActions.createPlaylist({
          title: title,
          description: description,
          playlist_play_type: playlist_play_type,
          start_date : start_date,
          end_date : end_date,
          start_time : start_time,
          end_time : end_time,
          // privacy: selectedPrivacy,
        });
      }
    } else {
      addClassname(nameRef.current, 'invalid');
    }
  }

  function playlistCreationCompleted(new_playlist_data) {
    // FIXME: Without delay creates conflict [ Uncaught Error: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. ].

    setTimeout(function () {
      PageActions.addNotification('Playlist created', 'playlistCreationCompleted');
      const plistData = {
        playlist_id: (function (_url_) {
          let ret = _url_.split('/');
          return 1 < ret.length ? ret[ret.length - 1] : null;
        })(new_playlist_data.url),
        add_date: new_playlist_data.add_date,
        description: new_playlist_data.description,
        title: new_playlist_data.title,
        media_list: [],
      };

      props.onPlaylistSave(plistData);
    }, 100);
  }

  function playlistCreationFailed() {
    // FIXME: Without delay creates conflict [ Uncaught Error: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. ].
    setTimeout(function () {
      PageActions.addNotification('Playlist creation failed', 'playlistCreationFailed');
    }, 100);
  }

  function onCancelPlaylistCreation() {
    props.onCancel();
  }

  useEffect(() => {
    MediaPageStore.on('playlist_creation_completed', playlistCreationCompleted);
    MediaPageStore.on('playlist_creation_failed', playlistCreationFailed);

    nameInputRef.current.focus();

    return () => {
      MediaPageStore.removeListener('playlist_creation_completed', playlistCreationCompleted);
      MediaPageStore.removeListener('playlist_creation_failed', playlistCreationFailed);
    };
  }, []);

  return (
    <div className="playlist-form-wrap">
      <div className="playlist-form-field playlist-title" ref={nameRef}>
        <span className="playlist-form-label">Title</span>
        <input
          ref={nameInputRef}
          type="text"
          placeholder="Enter playlist title..."
          value={title}
          onChange={onChangeTitle}
          onFocus={onFocusPlaylistNameInput}
          onBlur={onBlurPlaylistNameInput}
          onClick={onChangePlaylistNameInput}
        />
      </div>

      <div className="playlist-form-field playlist-description" ref={descriptionRef}>
        <span className="playlist-form-label">Description</span>
        <textarea
          ref={descriptionInputRef}
          rows="1"
          placeholder="Enter playlist description..."
          value={description}
          onChange={onChangeDescription}
          onFocus={onFocusDescription}
          onBlur={onBlurDescription}
        ></textarea>
      </div>


      <div className="playlist-form-field playlist-play-type">
        <span className="playlist-form-label">Playlist Play Type</span>
        <label>
  <select id="browsers" defaultValue={playlist_play_type} value={playlist_play_type} onChange={(e)=>{
      setPlaylist_play_type(e.target.value);
      console.log(e.target.value);

  }}>
    <option value="normal">Normal</option>
    <option value="schedueleddate">Schedueled Date Range</option>
    <option value="schedueledtime">Schedueled Time</option>
    <option value="schedueleddatetime">Schedueled Date Time Range</option>
  </select>
        </label>
      </div>

      


      {/*<div className="playlist-form-field playlist-privacy">
					<span className="playlist-form-label">Privacy</span>
					<label><input ref="privacyValue" type="radio" name="privacy" value="public" checked={ 'public' === selectedPrivacy } onChange={ onPrivacyChoose } /><span>Public</span></label>
					<label><input ref="privacyValue" type="radio" name="privacy" value="unlisted" checked={ 'unlisted' === selectedPrivacy } onChange={ onPrivacyChoose } /><span>Unlisted</span></label>
					<label><input ref="privacyValue" type="radio" name="privacy" value="private" checked={ 'private' === selectedPrivacy } onChange={ onPrivacyChoose } /><span>Private</span></label>
				</div>*/}

      <div className="playlist-form-actions">
        <button className="cancel-btn" onClick={onCancelPlaylistCreation}>
          CANCEL
        </button>
        <button className="create-btn" onClick={onClickPlaylistCreate}>
          {id ? 'UPDATE' : 'CREATE'}
        </button>
      </div>

    </div>
  );
}

PlaylistCreationForm.propTypes = {
  id: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onPlaylistSave: PropTypes.func.isRequired,
};
