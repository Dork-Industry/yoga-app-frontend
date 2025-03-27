import { ContentState, convertFromHTML, convertFromRaw, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import React, { useEffect, useState } from "react";
import { Form, Image } from "react-bootstrap";
import { Editor } from "react-draft-wysiwyg";

const InputField = ({ label, type, placeholder, setValue, row, defaultValue, min, errors, options, accept, ...props }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const onEditorStateChange = (state) => {
        setEditorState(state);
        const HTMLContent = stateToHTML(state.getCurrentContent());
        setValue(`${props.name}`, HTMLContent);
    }

    useEffect(() => {
        if (type === "rte") {
            if (defaultValue) {
                const rowConvert = convertFromHTML(defaultValue);
                const contentState = ContentState.createFromBlockArray(rowConvert.contentBlocks, rowConvert.entityMap);
                setEditorState(EditorState.createWithContent(contentState))
                setValue(`${props.name}`, defaultValue);
            }
        }
    }, []);

    return (
        <React.Fragment>
            <Form.Group>
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
                    <Form.Control as="textarea" rows={row} placeholder={placeholder} defaultValue={defaultValue} {...props} />
                ) : type === "multiselect" ? (
                    <Form.Select multiple {...props}>
                        {options.length > 0 && options.map((item, index) => {
                            return (<option key={index} value={item.Id}>{item.Exercise_Name}</option>)
                        })}
                    </Form.Select>
                ) : type === "image" ? (
                    <Image src={defaultValue} style={{ height: 100, width: 100 }} className="form-control" />
                ) : type === "video" ? (
                    <video className="form-control" controls>
                        <source src={defaultValue} type="video/mp4"></source>
                    </video>
                ) : (
                    <Form.Control type={type} placeholder={placeholder} defaultValue={defaultValue} min={min} accept={accept} {...props} />
                )}
                <span className="error text-danger d-block">{errors && errors.message}</span>
            </Form.Group>
        </React.Fragment>
    )
};
export default InputField;