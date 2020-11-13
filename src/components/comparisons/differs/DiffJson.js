import React from "react";

const typeOf = (value) => {
  return JSON.stringify(value)
  switch (typeof value) {
    case "boolean":
    // case "object":
      return JSON.stringify(value)
    case "number":
    case "string":
    default:
      return value
  }
}

const stringify = (value) =>
  JSON.stringify(value)


const isDiffObject = (diff) => {
  if(diff && diff.changes && diff.changes[0]) {
    return isNaN(diff.changes[0].key)
  }
}

const label = (diff) => {
  if(isDiffObject(diff)) {
    return <span>{diff.key} {"{"}</span>
  } else {
    return <span>[</span>
  }
}

const DiffJson = ({diff=[]}) =>
  <ul className="mks object list list-group">
    {
      diff.map((d, index) =>
        <li key={index} className="list-group-item mks">
          {
            isNaN(d.key)?
              <span>{d.key}&nbsp;:&nbsp;</span>:
              ""
          }
          {
            d.changes && d.changes[0] && d.changes[0].key && isNaN(d.changes[0].key) ?
              <span>{"{"}</span> : <span></span>
          }
          {
            d.changes && d.changes[0] && d.changes[0].key && !isNaN(d.changes[0].key) ?
              <span>{"["}</span> : <span></span>
          }
          {
            (typeOf(d.value) && typeOf(d.oldValue)) && d.type === "update" &&
            <div className="mks row">
              <div className="__old mks col-6">{typeOf(d.oldValue)}</div>
              <div className="__new mks col-6">{typeOf(d.value)}</div>
            </div>
          }
          {
            typeOf(d.value) && d.type === "remove" &&
            <div className="mks row">
              <div className="__old mks col-12">{typeOf(d.value)}</div>
            </div>
          }
          {
            typeOf(d.value) && d.type === "add" &&
            <div className="mks row">
              <div className="__new mks col-12">{typeOf(d.value)}</div>
            </div>
          }
          <DiffJson diff={d.changes}/>
          {
            d.changes && d.changes[0] && d.changes[0].key && isNaN(d.changes[0].key) ?
              <span>{"}"}</span> : <span></span>
          }
          {
            d.changes && d.changes[0] && d.changes[0].key && !isNaN(d.changes[0].key) ?
              <span>{"]"}</span> : <span></span>
          }
        </li>
      )
    }
  </ul>

export default DiffJson
