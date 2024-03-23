import React from "react";


const NoteForm = (props) =>{
    const {FormTitle, title, Content, titleChanged, ContentChanged, SumbitClicked, SumbitText} = props;

    return (
        <div>
          <h2>{FormTitle}</h2>
              <form>
              <input
                  type="text"
                  name="title"
                  className="form-input mb-30"
                  placeholder="العنوان"
                  value={title}
                  onChange={titleChanged}
                />

                <textarea
                  rows="10"
                  name="content"
                  className="form-input"
                  placeholder="النص"
                  value={Content}
                  onChange={ContentChanged}
                 />
              </form>
              <a href="#" className="button green" onClick={SumbitClicked}>{SumbitText}</a>
        </div>

    )
}
export default NoteForm;