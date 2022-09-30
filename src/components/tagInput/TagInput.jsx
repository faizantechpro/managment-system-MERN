import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';

import './TagInput.css';
import { CardLabel } from '../layouts/ActivityLayout';
import MaterialIcon from '../commons/MaterialIcon';

const TagInput = ({
  dropdownList = [],
  regex,
  placeholder,
  value = [],
  setValue,
  tooltip,
  label,
  labelSize,
  onChange,
  setBadEmail,
  icon,
}) => {
  const [tags, setTags] = useState(value);
  const [options, setOptions] = useState(dropdownList);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [textValue, setTextValue] = useState();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (showTooltip) {
      setTimeout(() => setShowTooltip(false), 4000);
    }
  }, [showTooltip]);

  useEffect(() => {
    setOptions(dropdownList);
  }, [dropdownList]);

  useEffect(() => {
    if (value.length) {
      if (regex) {
        const newTags = [];
        value.forEach((item) => {
          if (regex.test(item.email)) newTags.push(item);
        });
        setTags(newTags);
      } else {
        setTags(value);
      }
      if (!isEdit) setTextValue('');
      else setIsEdit(false);
    }
  }, [value]);

  useEffect(() => {
    if (dropdownList?.length) {
      if (tags.length) {
        const newList = [];
        dropdownList.forEach((el) => {
          for (let i = 0; i < tags.length; i++) {
            const item = tags[i];
            if (el.value === item.value) break;
            else if (i === tags.length - 1) {
              newList.push(el);
            }
          }
        });
        setOptions(newList);
      } else {
        setOptions(dropdownList);
      }
    }
  }, [tags, value, dropdownList]);

  const handleDropdown = (item) => {
    const newTags = [
      ...tags,
      { value: item.name, email: item.email, id: item.id },
    ];
    if (regex) {
      if (regex.test(item.email)) {
        setTextValue('');
        setTags(newTags);
        setValue(newTags);
        setShowTooltip(false);
        setShowDrop(false);
      } else {
        setShowTooltip(true);
      }
    } else {
      setTextValue('');
      setTags(newTags);
      setValue(newTags);
      setShowTooltip(false);
      setShowDrop(false);
    }
    setIsEdit(false);
  };

  const handleInput = (e) => {
    const {
      target: { value },
      key,
    } = e || {};
    if (key === 'Enter') {
      const newTags = [
        ...tags,
        { value, email: value, id: value, alert: !regex.test(value) },
      ];

      setTextValue('');
      setTags(newTags);
      setValue(newTags);
      setShowDrop(false);
      setIsEdit(false);
      setBadEmail(!regex.test(value));
    } else if (value.length) {
      setShowDrop(true);
    } else {
      setShowDrop(false);
    }
    onChange(value);
  };

  const removeTag = (index) => {
    const newValues = tags.filter((tag) => tags.indexOf(tag) !== index);
    setTags(newValues);
    setValue(newValues);
    setShowDrop(false);
    setBadEmail(false);
  };

  useEffect(() => {
    setTags(value);
  }, [value]);

  const editTag = (tag, index) => {
    if (tag.alert) {
      setIsEdit(true);
      removeTag(index);
      setTextValue(tag.value);
      onChange(tag.value);
    }
  };

  return (
    <CardLabel label={label} labelSize={labelSize}>
      <div className="tags-input-main">
        <Dropdown
          show={showDrop}
          onToggle={(open) => !open && setShowDrop(false)}
        >
          {tags.length ? (
            <ul className="tags">
              {tags.map((tag, i) => (
                <li
                  key={i}
                  className={`tag-item rounded-lg ${
                    tag.alert ? 'tag-alert' : ''
                  }`}
                >
                  <span
                    className="tag-title fs-8 font-weight-semi-bold"
                    onClick={() => editTag(tag, i)}
                  >
                    {tag.value} {Boolean(tag?.email) && `(${tag?.email})`}
                  </span>
                  <button
                    type="button"
                    className="button fs-8 ml-0"
                    onClick={() => removeTag(i)}
                  >
                    <MaterialIcon icon="close" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <OverlayTrigger
            show={showTooltip}
            placement="left"
            overlay={<Tooltip id={`tooltip-tag-input`}>{tooltip}</Tooltip>}
          >
            <Dropdown.Toggle className="tags-dropdown w-100 dropdown-input no-hover">
              <input
                id="input-guests"
                value={textValue}
                type="text"
                placeholder={placeholder}
                onChange={(e) => setTextValue(e.target.value)}
                onKeyUp={(e) => handleInput(e)}
              />
            </Dropdown.Toggle>
          </OverlayTrigger>
          {options.length ? (
            <Dropdown.Menu className="w-100" id={'dropdown-tags'}>
              <div>
                {options
                  .filter((item) => item?.email)
                  .map((item, i) => {
                    const id = `data-${i}-${item.id}`;
                    return (
                      <div
                        key={id}
                        onClick={() => {
                          handleDropdown(item);
                        }}
                      >
                        <Dropdown.Item>
                          {icon && (
                            <span
                              className="material-icons-outlined mr-1"
                              style={{ opacity: 0.5 }}
                            >
                              {icon}
                            </span>
                          )}

                          <span>
                            {item.name}
                            {Boolean(item?.email) && `(${item?.email})`}
                          </span>
                        </Dropdown.Item>
                      </div>
                    );
                  })}
              </div>
            </Dropdown.Menu>
          ) : null}
        </Dropdown>
      </div>
    </CardLabel>
  );
};

export default TagInput;
