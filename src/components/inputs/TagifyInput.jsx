import Tags from '@yaireo/tagify/dist/react.tagify'; // React-wrapper file
import '@yaireo/tagify/dist/tagify.css'; // Tagify CSS
import { useCallback, useEffect, useRef, useState } from 'react';

import { CardLabel } from '../layouts/ActivityLayout';

const TagifyInput = ({
  value,
  name,
  placeholder,
  label,
  size,
  labelSize,
  inputClassName,
  controlId,
  setValue,
  dropdownList,
  dropdownBlackList,
}) => {
  const [tagifyProps, setTagifyProps] = useState([{}]);

  // Tagify settings object
  const baseTagifySettings = {
    blacklist: dropdownBlackList,
    // backspace: "edit",
    placeholder: placeholder,
    dropdown: {
      enabled: 0, // a;ways show suggestions dropdown
    },
  };

  useEffect(() => {
    setTagifyProps({ loading: true });

    setTagifyProps((lastProps) => ({
      ...lastProps,
      whitelist: dropdownList,
      showFilteredDropdown: 'a',
      loading: true,
    }));

    // simulate setting tags value via server request
    setTagifyProps((lastProps) => ({ ...lastProps }));

    // simulate state change where some tags were deleted
    setTimeout(
      () =>
        setTagifyProps((lastProps) => ({
          ...lastProps,
          showFilteredDropdown: false,
        })),
      5000
    );
  }, []);

  const tagifyRef = useRef();

  // const Tag = ({ tagifyProps: [tagData, tagify] }) => (
  //   <tag
  //     title={tagData?.title || tagData?.value}
  //     contentEditable="true"
  //     spellCheck="false"
  //     tabIndex={tagify?.settings.a11y.focusableTags ? 0 : -1}
  //     className={`${tagify?.settings.classNames.tag} ${
  //       tagData?.class ? tagData?.class : ''
  //     }`}
  //     {...tagify?.getCustomAttributes(tagData)}
  //   >
  //     <x
  //       title=""
  //       className={tagify?.settings.classNames.tagX}
  //       role="button"
  //       aria-label="remove tag"
  //     ></x>
  //     <div>
  //       <span>Icono</span>
  //       <span className={tagify?.settings.classNames.tagText}>
  //         {(tagData && tagData[tagify?.settings.tagTextProp]) || tagData?.value}
  //       </span>
  //     </div>
  //   </tag>
  // );

  const tagifyHandler = useCallback((e) => {
    setValue(e.detail.tagify.value);
  }, []);

  const settings = {
    ...baseTagifySettings,
  };

  const TagifyInput = () => {
    return (
      <Tags
        className={`tagify-form-control`}
        tagifyRef={tagifyRef} // optional Ref object for the Tagify instance itself, to get access to  inner-methods
        settings={settings} // tagify settings object
        defaultValue=""
        value={value}
        onChange={tagifyHandler}
        {...tagifyProps}
      />
    );
  };

  return (
    <CardLabel label={label} labelSize={labelSize} controlId={controlId || ''}>
      <TagifyInput />
    </CardLabel>
  );
};

export default TagifyInput;
