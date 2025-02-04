import { StrictMode, Component } from 'react';
import { createRoot } from 'react-dom/client';
import React from "react";

interface Param {
  id: number;
  name: string;
  type: 'string' | 'number' | 'select'; 
  options?: string[]; 
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface Props {
  params: Param[],
  model: Model,
}

interface State {
  paramValues: { [key: number]: string };
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const paramValues: { [key: number]: string } = {};
    props.model.paramValues.forEach((pv) => {
      paramValues[pv.paramId] = pv.value;
    });

    this.state = {
      paramValues,
    };
  }

  handleChange = (paramId: number, value: string) => {
    this.setState((prevState) => ({
      paramValues: {
        ...prevState.paramValues,
        [paramId]: value,
      },
    }));
  };

  renderInput(param: Param) {
    const { paramValues } = this.state;

    switch (param.type) {
      case 'string':
        return (
          <input
            type="text"
            value={paramValues[param.id] || ""}
            onChange={(e) => this.handleChange(param.id, e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={paramValues[param.id] || ""}
            onChange={(e) => this.handleChange(param.id, e.target.value)}
          />
        );
      case 'select':
        return (
          <select
            value={paramValues[param.id] || ""}
            onChange={(e) => this.handleChange(param.id, e.target.value)}
          >
            <option value="">Выберите</option>
            {param.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return null;
    }
  }

  public getModel(): Model {
    return {
      paramValues: Object.keys(this.state.paramValues).map((paramId) => ({
        paramId: Number(paramId),
        value: this.state.paramValues[Number(paramId)],
      })),
    };
  }

  render() {
    const { params } = this.props;

    return (
      <div className="editor">
        {params.map((param) => (
          <div key={param.id} className="editor__row">
            <label className="editor__label">{param.name}:</label>
            {this.renderInput(param)}
          </div>
        ))}
      </div>
    );
  }
}

const ForwardedParamEditor = React.forwardRef<ParamEditor, Props>((props, ref) => (
  <ParamEditor {...props} ref={ref} />
));

const params: Param[] = [
  { id: 1, name: 'Назначение', type: 'string' },
  { id: 2, name: 'Длина', type: 'string' },
  { id: 3, name: 'Цена', type: 'number' },
  { id: 4, name: 'Цвет', type: 'select', options: ['Красный', 'Зелёный', 'Синий'] },
];

const model: Model = {
  paramValues: [
    { paramId: 1, value: 'повседневное' },
    { paramId: 2, value: 'макси' },
    { paramId: 3, value: '1000' },
    { paramId: 4, value: 'Красный' },
  ],
};

const App = () => {
  const editorRef = React.createRef<ParamEditor>();

  const handleSave = () => {
    if (editorRef.current) {
      console.log("Update Model:", editorRef.current.getModel());
    }
  };

  return (
    <div className='app'>
      <h1>Редактор параметров</h1>
      <ForwardedParamEditor ref={editorRef} params={params} model={model}/>
      <button onClick={handleSave} className="editor__button">
        Сохранить
      </button>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
