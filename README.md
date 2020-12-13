## [Part 2 - Communicating with server](https://fullstackopen.com/en/part2)

> **Important concepts learned**
>
> - importing and exporting modules
>
>
> - Forms and event handlers
>
>
> - useEffect hooks
>
>
> - axios

* [2a Rendering a collection, modules](#2a-rendering-a-collection-modules)
* [2b Forms](#2b-forms)
* [2c Getting data from server](#2c-getting-data-from-server)
* [2d Altering data in server](#2d-altering-data-in-server)
* [Adding styles to react app](#2e-adding-styles-to-react-app)

### 2a: Rendering a collection, modules

> **Tech used:**
> map, import, export

I generated a list of notes from an array using the **map()** array function. The attribute called key is necessary for list elements generated by the map method.

    notes.map(note => <li key={note.id}>{note.content}</li>)

The concept of importing and exporting modules is introduced in this chapter. By moving components to its own modules, we can modularize and tidy up our code. 

### 2b: Forms

> **Tech used:**
> forms, state hook

In this chapter, I learned to use forms for manipulating state, such as adding notes to our note app. I also learned to attach event handlers to the onSubmit  attribute of our form element.

    <form onSubmit = {addNote}>
        <input value={newNote} onChange={handleNoteChange} />
    </form>

I also learned to create an event handler that synchronizes the state of our note whenever the user changes the input. This function is called every time a change occurs in the input element.

    const handleNoteChange = (event) => {
    	setNewNote(event.target.value)
    }

Filtering elements to be displayed is also possible using state hooks. In the case of the notes app, we can choose to either show all notes or only show notes with key-value important === true.

    const [showAll, setShowAll] = useState(true)
    const notesToShow = showAll
        ? notes
    	: notes.filter(note => note.important === true)
    
    {notesToShow.map(note => 
    	<Note key=>{note.id} note ={note}
    	)}  

### 2c: Getting data from server

> **Tech used:**
> [JSON Server](https://github.com/typicode/json-server), [axios](https://github.com/axios/axios), effect hooks

For the local development, the material made use of JSON Server to act as a local server on port 3001. I made a script in our package.json file to easily run the json server.

    "server": "json-server -p3001 --watch db.json"

To run this script, I simply run *$ npm run server* on the terminal. The files that would be used are contained in db.json at our project's root.

Axios was used together with useEffect hook for fetching data from our local server. By default, effects run after every completed render. The second parameter specifies how often the effect is run. Since we made use of empty array [], the effect is only run along the first render of our component.

    useEffect(() => {
        axios.get(http://localhost:3001/notes').then(res => {
    	    setNotes(res.data)
    	})
    }, [])

### 2d: Altering data in server

> **Tech used:**
> [axios](https://github.com/axios/axios)

Axios post method was used to post new notes to our server. Axios put method was used to alter data in the server, in the case of our note app, toggling the importance of notes.

I created a function for toggling importance and used **object spread** syntax to create the new note object that would be used to replace the old note. This is done because in React, we should never directly mutate state.

    const changedNote = {...note, important: !note.important}

### 2e: Adding styles to React app

> **Tech used:**
> css class selectors

In react, we use the *className* attribute instead of class in HTML. I created a simple notification banner with some styling to alert the user for errors. The notification would display the error message for 5 seconds, and after that will return to null.

    const [errorMessage, setErrorMessage] = useState('Error')
    
    //
    .catch(error => {
    	setErrorMessage(`Error! ${note.content} does not exist`)
    	setTimeout(() => {
    		setErrorMessage(null)
    	}, 5000)
