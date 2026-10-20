import { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxWrap4 extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  children?: ReactNode;
}

export default function CheckboxWrap4({ id, children, ...props }: CheckboxWrap4) {
  return (
    <div className="checkbox-wrapper-4">
      <input className="inp-cbx" id={id} type="checkbox" {...props} />
      <label className="cbx" htmlFor={id}>
        <span>
          <svg width="12px" height="10px">
            <use xlinkHref="#check-4" />
          </svg>
        </span>
        <span>{children}</span>
      </label>

      <svg className="inline-svg">
        <symbol id="check-4" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </symbol>
      </svg>
    </div>
  );
}
