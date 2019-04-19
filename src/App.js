import React, { Component } from 'react'
import Header from './components/ui/Header/Header'

class App extends Component {

  constructor() {
    super()
this.addBook=this.addBook.bind(this);
this.removeBook=this.removeBook.bind(this);
this.addListItem=this.addListItem.bind(this);
this.newApiKey=this.newApiKey.bind(this);
this.getBooks()
    this.state = {
      list: [],
      title: "",
      author: ""
    }
  }
  request(qs, cb, limit = 10) {
    const url = 'https://www.forverkliga.se/JavaScript/api/crud.php?'
   
    fetch(`${url}${qs}`)
      .then(function(response) {
      
        return response.json()
      })
      .then(function(data) {
       
        if (data.status === 'success') {
          if (cb) {
            cb(data)
            
          }
        } else if (limit > 0) {
          this.request(qs, cb, limit - 1)
         
        } else {
          console.log(data.message)
          
        }
      })
      .catch(function(error) {
        console.log("Try again")
      })
  }
  newApiKey(callback) {
    this.request('requestKey', function(data) {
      console.log(data)
      localStorage.setItem('apiKey', data.key)
      document.getElementById("Key").innerHTML="Current key: "+localStorage.getItem('apiKey')
      window.location.reload();
      if (callback) {
        callback(data.key)
      }
    })
  }

  getBooks() {
    const url = "https://www.forverkliga.se/JavaScript/api/crud.php?"
    const key = localStorage.getItem('apiKey')
    fetch(url + "key=" + key + '&op=select')
        .then(response => response.json())
        .then(result =>{
          if(result.status === "success"){
            this.setState({ list: result.data })
          }else if(result.status==="error"){
            this.getBooks()
          }
        })
  }
  

  

  addBook(e) {
    const key = localStorage.getItem('apiKey')
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
      this.request(`key=${key}&op=insert&title=${title}&author=${author}`, function(
        data
      ) {
        console.log("Book was added")
      }
      )
    
  }
  removeBook(event,id){
    const key = localStorage.getItem('apiKey')
    this.request(`key=${key}&op=delete&id=${id}`,function(
      data
    ) {
      console.log("Deleted")
      window.location.reload()
    })
    
  } 
  
  addListItem() {
    try {
      return this.state.list.map(book => {
        return (
          <li key={book.id} className="list-item list-group-item d-flex align-items-center">
            <strong className="title">{book.title}</strong>
            <div className="author">{book.author}</div>
            <div className="buttons">
              <button type="button" className="btn btn-danger" onClick={event=>this.removeBook(event,book.id)}>
                Ta bort
        </button>
            </div>
          </li>
        )
      })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    
    return (
      <div className="App">
      <Header />
      <button
                id="btn1"
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                onClick={this.newApiKey}
              >
                NewApiKey
              </button>
              <p id="Key">Current key: {localStorage.getItem('apiKey')}</p>
        <div className="container">
          <div className="row form-section">
            <form className="book-form col-6">
              <legend>Lägg till dina favoritböcker</legend>
              <div className="form-group">
              

                <input
                  type="text"
                  className="form-control"
                  id="title"
                  aria-describedby="title"
                  placeholder="Lägg till titel"
                />

                <input
                  type="text"
                  className="form-control"
                  id="author"
                  rows="3"
                  data-gramm="true"
                  data-txt_gramm_id="63b74fb6-c7e4-7f0e-0c1f-438d47ac87a0"
                  data-gramm_id="63b74fb6-c7e4-7f0e-0c1f-438d47ac87a0"
                  data-gramm_editor="true"
                  placeholder="Lägg till författare"
                />
              </div>
              <button
                id="btn"
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                onClick={this.addBook}
              >
                Skicka
              </button>
            </form>
          </div>
        </div>
        <div className="display-books">
          <div className="container">
            <div className="col-12">
              <ul className="list-group">
              <li key="Info" className="list-item list-group-item d-flex align-items-center">
            <strong className="title">Title</strong>
            <div className="author"><strong>Author</strong></div>
            <div className="buttons"><strong>Delete </strong></div>
          </li>
              {this.addListItem()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
