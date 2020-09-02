

export class Contact {

  // Les données d'un objet contact
  public id:string;
  public gender:string;
  public name = {
   title:'',
   first:'',
   last:'',
  };

  public email:string;
  public cell:string;

  public picture = {
   large:'',
   thumbnail:''
  };

  public registered = {
   date: new Date()
  }

  public location = {
   street:'',
   postcode:'',
   city:''
  }

  // Construction de l'objet
  constructor(title,first, last, email, cell, street, postcode, city) {

    this.name.title = title;
    this.name.first = first;
    this.name.last = last;

    this.email = email;
    this.cell = cell;

    this.picture.thumbnail="https://vignette.wikia.nocookie.net/pokeone/images/7/77/Pikachu.png/revision/latest?cb=20180916045441";
    this.picture.large="https://vignette.wikia.nocookie.net/pokeone/images/7/77/Pikachu.png/revision/latest?cb=20180916045441";

    this.location.street = street;
    this.location.postcode = postcode;
    this.location.city = city;


  }

}