import React, { useState, useEffect } from 'react';
import Preview from './components/preview';
import './App.css';
import Message from './components/preview/Message';
import NoteContainer from './components/Notes/NoteContainer';
import NotesList from './components/Notes/NotesList';
import Note from './components/Notes/note';
import NoteForm from './components/Notes/NoteForm';
import Alert from './components/Alert';

function App() {
  const [Notes, setNotes]=useState([]);
  const [Title, setTitle]=useState('');
  const [Content, setContent]=useState('');
  const [SelectedNote, setSelectedNote]=useState(null);
  const [Creating, setCreating]=useState(false);
  const [Edtitng, setEdtitng]=useState(false);
  const [validationErrors, setValidationError] = useState([])

useEffect(() => {
      if(localStorage.getItem("Notes")){
      setNotes(JSON.parse(localStorage.getItem('Notes')))
      }else{
      localStorage.setItem('Notes', JSON.stringify([]))
      }
},[]);

const saveToLocalStorage =(key,value)=>{
    localStorage.setItem(key, JSON.stringify(value))
};
useEffect(() => {
  if(validationErrors.length !==0){
    setTimeout (() => {
      setValidationError([])
    },3000)
  }
},[validationErrors])

const validate = ()=>{
  const validationErrors=[];
  let passed = true;
  if(!Title){
    validationErrors.push("الرجاء ادخال عنوان الملاحظة");
    passed=false;
  }
  if(!Content){
    validationErrors.push("الرجاء ادخال محتوي الملاحظة")
    passed=false;
  }
  setValidationError(validationErrors)
  return passed;
};
  //تغيير عنوان الملاحظة
  const changeTitleHandler =(e) => setTitle(e.target.value);

  //تغيير عنوان الملاحظة
  const changeContentHandler =(e) => setContent(e.target.value);

//حفظ الملاحظة

const saveNoteHandler = () => {
  if(!validate()) return;
  const note = {
    id :new Date(),
    Title : Title,
    Content : Content,
  }
  const updatedNotes =[...Notes, note];
  saveToLocalStorage('Notes', updatedNotes)
  setNotes(updatedNotes);
  setCreating(false);
  setSelectedNote(note.id);
  setTitle("");
  setContent("");
}
//اختيار ملاحظة
const SelectNoteHandler = (noteId) =>{
  setSelectedNote(noteId)
  setEdtitng(false);
  setCreating(false)
}

const editNoteHandler = () =>{
  const note = Notes.find(note => note.id === SelectedNote);
  setEdtitng(true);
  setTitle(note.Title);
  setContent(note.Content)
}
const UpdatNoteHandler = () => {
  if(!validate()) return;
  const updatedNotes = [...Notes];
  const noteIndex = Notes.findIndex(note => note.id === SelectedNote);
  updatedNotes[noteIndex] ={
    id: SelectedNote,
    Title:Title,
    Content:Content,
  } 
  setNotes(updatedNotes);
  saveToLocalStorage('Notes', updatedNotes)
  setTitle('');
  setContent('')
  setEdtitng(false)
}
//حذف ملاحظة

const DeleteNoteHandler = () => {
  const updatedNotes = [...Notes];
  const noteIndex = updatedNotes.findIndex(note => note.id === SelectedNote);
  Notes.splice(noteIndex,1);
  saveToLocalStorage('Notes', Notes)
  setNotes(Notes);
  setSelectedNote(null)
}



//اضافه ملاحظة
  const addNoteHandler = () =>
  {
    setCreating(true);
    setEdtitng(false);
    setTitle('')
    setContent('')
  };

  const getAddNote = () => {
    return (
     <NoteForm
      FormTitle="ملاحظة جديدة"
      title={Title}
      Content={Content} 
      titleChanged = {changeTitleHandler}
      ContentChanged={changeContentHandler}
      SumbitText ="حفظ"
      SumbitClicked = {saveNoteHandler} />
    );
  };

  const getPreview = () => {
    if(Notes.length === 0){
      return <Message title="لا يوجد ملاحظات" />
    };
    if (!SelectedNote){
      return <Message title="الرجاء اختيار ملاحظة" />
    }
    const note = Notes.find(note =>{
      return note.id == SelectedNote;
    });
    let noteDisplay = (
      <div>
        <h2>{note.Title}</h2>
        <p>{note.Content}</p>
      </div>
    )
    if(Edtitng){
      noteDisplay =(
        <NoteForm
          FormTitle="تعديل ملاحظة"
          title={Title}
          Content={Content} 
          titleChanged = {changeTitleHandler} 
          ContentChanged={changeContentHandler}
          SumbitText ="تعديل"
          SumbitClicked = {UpdatNoteHandler} />
      )
    }
    return (
      <div>
        {!Edtitng && 
             <div className="note-operations">
             <a href="#">
               <i className="fa fa-pencil-alt" onClick={editNoteHandler} />
             </a>
             <a href="#">
               <i className="fa fa-trash" onClick={DeleteNoteHandler} />
             </a>
           </div>
        }
        {noteDisplay}
      </div>
    );
  };

  return (
    <div className="App">
      <NoteContainer>
      <NotesList>
           {Notes.map(note => <Note key={note.id}
            title={note.Title} 
            noteClicked ={()=> SelectNoteHandler(note.id)} 
            active ={SelectedNote === note.id}
           />)}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </NoteContainer>

      <Preview>{Creating ? getAddNote() : getPreview()}</Preview>
      
      {validationErrors.length !== 0 && <Alert  validationMessages={validationErrors}/>}
    </div>
  );
}

export default App;
