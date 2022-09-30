import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from '@draft-js-plugins/mention';
import '@draft-js-plugins/mention/lib/plugin.css';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton,
} from '@draft-js-plugins/buttons';

import { CardButton } from '../layouts/CardLayout';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import editorStyles from './SimpleMentionEditor.module.css';
import mentions from './mentions';

const MentionsInput = ({
  handleSubmit,
  defaultState,
  readOnly,
  placeholder,
  type,
  onHandleCancel,
  isLoading,
  submitLabel,
  alignButtons,
  setOverlay,
  from,
  feedInfoNotes,
  notes,
  setRichNote,
  richNote,
}) => {
  const [hasContent, setHasContent] = useState(false);
  const [editorState, setEditorState] = useState(() => {
    // org profile was crashing here
    if (defaultState) {
      setHasContent(true);
      if (typeof defaultState === 'string') {
        return EditorState.createWithContent(
          ContentState.createFromText(defaultState)
        );
      }
      return EditorState.createWithContent(convertFromRaw(defaultState));
    }
    return EditorState.createEmpty();
  });
  const [open, setOpen] = useState(false);
  const [mentionsData, setMentionsData] = useState([]);
  const [suggestions, setSuggestions] = useState(mentionsData);

  const { MentionSuggestions, plugins, Toolbar } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    const { MentionSuggestions } = mentionPlugin;
    const staticToolbarPlugin = createToolbarPlugin();
    const { Toolbar } = staticToolbarPlugin;

    const plugins = [mentionPlugin, staticToolbarPlugin];
    return { plugins, MentionSuggestions, Toolbar };
  }, []);

  const onOpenChange = useCallback((_open) => {
    setOpen(_open);
  }, []);

  const onSearchChange = useCallback(
    ({ value }) => {
      setSuggestions(defaultSuggestionsFilter(value, mentionsData));
    },
    [mentionsData]
  );

  useEffect(() => {
    if (from && from === 'activity') {
      if (feedInfoNotes) {
        setEditorState(() =>
          EditorState.createWithContent(
            ContentState.createFromText(feedInfoNotes)
          )
        );
      }
    }
  }, [feedInfoNotes]);

  const onExtractData = async (e) => {
    e.preventDefault();
    const contentState = editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    await handleSubmit(raw);
    clearState();
  };

  const clearState = () => {
    setEditorState(() => EditorState.createEmpty());
  };

  const getMentions = async () => {
    if (!readOnly) {
      setMentionsData(await mentions());
      if (!from || from !== 'activity') {
        setEditorState(EditorState.moveFocusToEnd(editorState));
      }
    }
  };

  const onChange = (e) => {
    const hasText = e.getCurrentContent().hasText();

    if (from) {
      const contentState = e.getCurrentContent();
      const raw = convertToRaw(contentState);

      setRichNote(raw);
    }

    if (hasText && !readOnly) {
      setEditorState(e);
    }

    setHasContent(hasText);
  };

  useEffect(() => {
    getMentions();
  }, []);

  useEffect(() => {
    if (from && !richNote) {
      setEditorState(EditorState.createEmpty());
    }
  }, [richNote]);

  return (
    <div>
      {editorState !== undefined && (
        <>
          <div
            className={readOnly ? '' : editorStyles[type]}
            style={{ backgroundColor: '#FFF8BC' }}
            onClick={() => {
              if (!editorState.getSelection().getHasFocus()) {
                setEditorState(EditorState.moveFocusToEnd(editorState));
              }
            }}
          >
            <Editor
              placeholder={placeholder}
              editorKey={'editor'}
              editorState={editorState}
              onChange={onChange}
              plugins={plugins}
              readOnly={readOnly}
            />
            <MentionSuggestions
              open={open}
              onOpenChange={onOpenChange}
              suggestions={suggestions}
              onSearchChange={onSearchChange}
            />
          </div>
          {!readOnly && (
            <Toolbar>
              {(externalProps) => (
                <>
                  <BoldButton {...externalProps} />
                  <ItalicButton {...externalProps} />
                  <UnderlineButton {...externalProps} />
                  <UnorderedListButton {...externalProps} />
                  <OrderedListButton {...externalProps} />
                </>
              )}
            </Toolbar>
          )}
        </>
      )}
      {!from && (
        <form onSubmit={onExtractData} onReset={clearState}>
          {!readOnly && (
            <div className={`text-${alignButtons} my-2`}>
              {type === 'editor' && !onHandleCancel && (
                <CardButton
                  type="button"
                  className="mx-2"
                  title="Cancel"
                  variant="white"
                  onClick={() => setOverlay(false)}
                />
              )}
              <CardButton
                type="submit"
                title={submitLabel}
                variant="primary"
                isLoading={isLoading}
                disabled={!hasContent}
              />
              {type !== 'editor' && (
                <CardButton
                  type={onHandleCancel ? 'button' : 'reset'}
                  title="Cancel"
                  className="mx-2"
                  variant="white"
                  onClick={onHandleCancel && onHandleCancel}
                />
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

MentionsInput.defaultProps = {
  mentions: [],
  handleSubmit: () => {},
  defaultState: undefined,
  readOnly: false,
  type: 'editor',
  submitLabel: 'Save',
  alignButtons: 'left',
};

export default MentionsInput;
