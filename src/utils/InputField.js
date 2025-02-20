import { ContentState, convertFromHTML, convertFromRaw, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";

const InputField = ({ label, type, placeholder, required, setValue, row, defaultValue, min, options,...props }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = (state) => {
        setEditorState(state);
        const HTMLContent = stateToHTML(state.getCurrentContent());
        setValue(`${props.name}`, HTMLContent);
    }

    useEffect(() => {
        if (type === "rte") {
            if(defaultValue){
                const rowConvert = convertFromHTML(defaultValue);
                const contentState = ContentState.createFromBlockArray(rowConvert.contentBlocks, rowConvert.entityMap);
                setEditorState(EditorState.createWithContent(contentState))
            }
        }
    }, []);

    return (
        <React.Fragment>
            <Form.Group className="mb-3">
                {label && <Form.Label>{label}</Form.Label>}
                {type === "rte" ? (
                    <Editor
                        editorState={editorState}
                        onEditorStateChange={onEditorStateChange}
                        toolbarClassName="mx-2"
                        wrapperClassName="form-control px-0"
                        editorClassName="mx-2"
                    />
                ) : type === "textarea" ? (
                    <Form.Control as="textarea" rows={row} placeholder={placeholder} required={required} defaultValue={defaultValue} {...props} />
                ) : type === "multiselect" ? (
                    <Form.Select multiple {...props}>
                        {options.length > 0 && options.map((item, index)=>{
                            return(<option key={index} value={item.Id}>{item.Exercise_Name}</option>)
                        })}
                    </Form.Select>
                ) : (
                    <Form.Control type={type} placeholder={placeholder} required={required} defaultValue={defaultValue} min={min} {...props} />
                )}

            </Form.Group>
        </React.Fragment>
    )
};
export default InputField;