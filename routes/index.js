
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost:27017/pokemonCards");

const pokemonCardSchema = new Schema ({
  name: String,
  type: [{
    elementDamage: String,
    weakness: String
  }],
  skill: [String],
  hp: String

});



const cards = mongoose.model('cards', pokemonCardSchema);

router.get('/', function(req, res){
  cards.find({}).then(function(allCards){
    // console.log(allCards);
    res.render("index", {allCards: allCards})
  })

})

router.post('/', function(req, res){
  let card = new cards({
    name: req.body.name,
    skill: req.body.skill,
    hp: req.body.hp
  });
  card.type.push({elementDamage: req.body.elementDamage, weakness: req.body.weakness});
  console.log(card.toObject());
  card.save().then(function(newCard){
    // console.log(newCard);
    res.redirect("/")
  });
});

router.post("/:cardId/delete", function(req, res) {
    cards.deleteOne({_id: req.params.cardId}).then(function(card){
      res.redirect("/");
    })

});

router.get("/:cardId/edit", function(req, res){
  cards.findOne({_id: req.params.cardId}).then(function(allCards){
    // console.log(allCards);
    res.render("edit", {allCards: allCards})
  })
});

router.post("/edit", function(req, res){
  cards.updateOne({
    _id: req.body.button
    },

    { name: req.body.name,
      skill: req.body.skill,
      hp: req.body.hp,
      'type.0': {elementDamage: req.body.elementDamage, weakness: req.body.weakness}
      // 'type.1': req.body.weakness
    }).then(function(card){
      // console.log(_id);
    res.redirect("/");
  })
});


module.exports = router;
