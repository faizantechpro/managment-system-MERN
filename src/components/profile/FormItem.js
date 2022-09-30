import React from 'react';

function FormItem({
  children,
  title,
  icon,
  labelFor,
  sizeLabel = '3',
  sizeInput = '8',
  classLabel,
}) {
  return (
    <div className="row form-group">
      <label
        htmlFor={labelFor}
        className={`col-sm-${sizeLabel} col-form-label input-label ${classLabel}`}
        data-uw-styling-context="true"
      >
        {title}
        {icon && (
          <i
            className="material-icons-outlined text-body ml-1"
            data-toggle="tooltip"
            data-placement="top"
            title=""
            data-original-title="Displayed on public forums, such as Identifee."
            data-uw-styling-context="true"
          >
            {icon}
          </i>
        )}
      </label>

      <div className={`col-sm-${sizeInput}`}>{children}</div>
    </div>
  );
}

export default FormItem;
