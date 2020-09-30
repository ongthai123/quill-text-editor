import React from "react";
import { render } from "react-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styles.css";

const CustomToolbar = (props) => (
  <div id="toolbar">
    <select className="ql-font" defaultValue="arial">
      <option value="arial">Arial</option>
      <option value="comic-sans">Comic Sans</option>
      <option value="courier-new">Courier New</option>
      <option value="georgia">Georgia</option>
      <option value="helvetica">Helvetica</option>
      <option value="lucida">Lucida</option>
    </select>
    <select className="ql-size" defaultValue="medium">
      <option value="extra-small">Size 1</option>
      <option value="small">Size 2</option>
      <option value="medium">Size 3</option>
      <option value="large">Size 4</option>
    </select>
    <select className="ql-align" />
    <select className="ql-color" />
    <select className="ql-background" />
    <button className="ql-clean" />
    <button className="ql-link" />
    <button className="ql-image" />
    <button className="ql-bold" />
    <button className="ql-underline" />
    <button className="ql-strike" />
    <button className="ql-code" />
    <button className="ql-list" value="bullet"/>
    <button className="ql-list" value="ordered"/>
    <button className="ql-indent" value="-1"/>
    <button className="ql-indent" value="+1"/>
    <button className="ql-copy" onClick={props.getFormat}>Copy Format</button>
    <button className="ql-paste" onClick={props.pasteFormat}>Paste Format</button>
  </div>
);

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida"
];
Quill.register(Font, true);

const Image = Quill.import("formats/image");
Quill.register(Image, true);

const Align = Quill.import("formats/align");
Quill.register(Align, true);

const Bold = Quill.import("formats/bold");
Quill.register(Bold, true);

const Strike = Quill.import("formats/strike");
Quill.register(Strike, true);

const Underline = Quill.import("formats/underline");
Quill.register(Underline, true);

const Link = Quill.import("formats/link");
Quill.register(Link, true);

const Background = Quill.import("formats/background");
Quill.register(Background, true);

const Code = Quill.import("formats/code");
Quill.register(Code, true);

const List = Quill.import("formats/list");
Quill.register(List, true);

const Indent = Quill.import("formats/list");
Quill.register(Indent, true);


class Editor extends React.Component {
  constructor(props) {
    super(props)
    this.quillRef = null;
    this.reactQuillRef = null;
    this.attachQuillRefs = this.attachQuillRefs.bind(this);
  }
  state = {
    editorHtml: "",
    currentSelection: {},
    currentSelectionFormat: {}
  };

  componentDidMount() {
    this.attachQuillRefs()
  }

  attachQuillRefs() {
    // Ensure React-Quill reference is available:
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    // Skip if Quill reference is defined:
    if (this.quillRef != null) return;

    const quillRef = this.reactQuillRef.getEditor();
    if (quillRef != null) this.quillRef = quillRef;
  }

  handleChange = (html, param2) => {
    this.setState({ editorHtml: html });
    // console.log("html: ", html)
    // console.log("param2: ", param2)
  };

  handleSelectionChange = (range, param2) => {
    console.log("range: ", range)
    // console.log("param2: ", param2)

    this.setState({ currentSelection: range })

  }

  //Copy format of selected text
  getFormat = () => {
    const { currentSelection } = this.state;

    var quill = this.quillRef;

    const currentSelectionFormat = quill.getFormat(currentSelection.index, currentSelection.length);

    this.setState({ currentSelectionFormat: currentSelectionFormat })
  }

  //Paste selected format to new selected text
  pasteFormat = () => {
    const { currentSelection, currentSelectionFormat } = this.state;

    var quill = this.quillRef;

    quill.formatText(currentSelection.index, currentSelection.length, currentSelectionFormat);
  }

  static modules = {
    toolbar: {
      container: "#toolbar",
    }
  };

  static formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "align",
    "background",
    "code"
  ];

  render() {
    return (
      <div className="text-editor">
        <CustomToolbar
          getFormat={this.getFormat}
          pasteFormat={this.pasteFormat}
        />
        <ReactQuill
          id="editor"
          ref={(el) => { this.reactQuillRef = el }}
          value={this.state.editorHtml}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          modules={Editor.modules}
          formats={Editor.formats}
          onChangeSelection={this.handleSelectionChange}
        />
      </div>
    );
  }
}

const App = () => (
  <div className="custom-toolbar-example">
    <Editor placeholder={"Write something ..."} />
  </div>
);

render(<App />, document.getElementById("root"));
