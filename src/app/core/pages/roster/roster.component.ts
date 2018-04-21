import { Component, OnInit, OnDestroy,Input } from '@angular/core';
import { MongoService } from '../../../services/mongo.service';
import { Http, Response } from "@angular/http"
import { TableColumn,ColumnMode } from '@swimlane/ngx-datatable';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnDestroy,OnInit {
  @Input() rows = [];
  columns;
  editing = {};
  specs = []
  icons = ["assets/tankIcon.png","assets/tankIcon.png","assets/tankIcon.png"]
  mongoData;
  newData;

  constructor(private mongoService:MongoService) {
    this.rows=[{}];
    this.columns= [
                    { name: 'name',prop: 'name' },
                    { name: 'server',prop: 'server' },
                    { name: 'class',prop: 'class' },
                    { name: 'spec',prop: 'spec' },
                    { name: 'role',prop: 'role' }
                  ];        
  }
  
  dataModel2 = this.rows;
  renderTable = true;

  ngOnInit() {
    this.mongoService.getGuild({"guildName":"Untamed"})
      .subscribe(res => {
        this.rows = []
        this.mongoData = res.json().data;
        delete this.mongoData._id
        if(res.json().data.Roster!= undefined) {
          res.json().data.Roster.forEach(element => {
            this.rows.push({name:element["name"],server:element["server"],class:element["class"],spec:element["spec"]})
          });
        } else  {
          this.rows = [{name:"name",server:"server",class:"Priest",spec:"Holy"}];
        }
        this.newData = this.rows;
        this.updateExtras();
      });
  }

  ngOnDestroy() {
  }

  addMember(event){
    this.rows.push({name:"",server:"",class:"Priest",spec:"Holy"})
    this.editing[this.rows.length-1+"-name"] = true
    this.editing[this.rows.length-1+"-server"] = true
    this.editing[this.rows.length-1+"-class"] = true
    this.updateExtras();
    this.rows = [...this.rows];
    this.newData = this.rows;
  }

  saveRoster($event){
    console.log(this.newData)
    this.mongoData["Roster"] = this.newData;
    console.log(this.mongoData.Roster)
    this.mongoService.updateGuild({data:this.mongoData,query:{guildName:"Untamed"}})
      .subscribe(res => {
        console.log(res)
      })
  }

  deleteRow(rowIndex){
    this.rows.splice(rowIndex,1)
    this.rows = [...this.rows];
  }
  
  updateRows(){
    console.log("updateRow");
  }

  updateValue(event, cell, rowIndex){
    if(event.target.value != ""){
      this.editing[rowIndex + '-' + cell] = false;
      this.rows[rowIndex][cell] = event.target.value;
      this.rows = [...this.rows];
      this.updateExtras();
      if(cell=="class")
        this.rows[rowIndex].spec = this.specs[rowIndex][0].name;
    }
    
  }

  getRowClass(row) {
    return  {
      'row-class-deathKnight': row.class === "Death Knight",
      'row-class-demonHunter': row.class === "Demon Hunter",
      'row-class-druid': row.class === "Druid",
      'row-class-hunter': row.class === "Hunter",
      'row-class-mage': row.class === "Mage",
      'row-class-monk': row.class === "Monk",
      'row-class-paladin': row.class === "Paladin",
      'row-class-priest': row.class === "Priest",
      'row-class-rogue': row.class === "Rogue",
      'row-class-shaman': row.class === "Shaman",
      'row-class-warlock': row.class === "Warlock",
      'row-class-warrior': row.class === "Warrior"
    }
  }
  
  // DRAG and DROP - Virtual Scroll
  onDrop(event){
    // ngx-datatable recommends you force change detection
    let listData = event.split("\n");
    this.newData = [];
    for(var i=0;i<(listData.length/5)-1;i++) {
      var saveData = {name: listData[i*5], server: listData[i*5+1], class: listData[i*5+2], spec: listData[i*5+3]};
      this.newData.push(saveData);
      }
  }
  ShowDebuger($event){
    console.log(this.rows);
  }

  updateExtras(){
    var specList= {
      "Death Knight":[{"name":"Melee"},{"name":"Frost"},{"name":"Unholy"},{"name":"Blood"}],
      "Demon Hunter":[{"name":"Havoc"},{"name":"Vengeance"}],
      "Druid":[{"name":"Balance"},{"name":"Restoration"},{"name":"Feral"},{"name":"Guardian"}],
      "Hunter":[{"name":"Ranged"},{"name":"Marksmanship"},{"name":"BeastMastery"},{"name":"Survival"}],
      "Mage":[{"name":"Ranged"},{"name":"Frost"},{"name":"Fire"},{"name":"Arcane"}],
      "Monk":[{"name":"Brewmaster"},{"name":"Mistweaver"},{"name":"Windwalker"}],
      "Paladin":[{"name":"Retribution"},{"name":"Holy"},{"name":"Protection"}],
      "Priest":[{"name":"Holy"},{"name":"Shadow"},{"name":"Discipline"}],
      "Rogue":[{"name":"Melee"},{"name":"Assassination"},{"name":"Outlaw"},{"name":"Subtlety"}],
      "Shaman":[{"name":"Elemental"},{"name":"Restoration"},{"name":"Enhancement"}],
      "Warlock":[{"name":"Ranged"},{"name":"Destruction"},{"name":"Affliction"},{"name":"Demonology"}],
      "Warrior":[{"name":"Melee"},{"name":"Arms"},{"name":"Fury"},{"name":"Protection"}]
    }
    const roleCheck = {
      "Frost":"dps",
      "Unholy":"dps",
      "Havoc":"dps",
      "Balance":"dps",
      "Feral":"dps",
      "Marksmanship":"dps",
      "BeastMastery":"dps",
      "Survival":"dps",
      "Fire":"dps",
      "Arcane":"dps",
      "Windwalker":"dps",
      "Retribution":"dps",
      "Shadow":"dps",
      "Assassination":"dps",
      "Outlaw":"dps",
      "Subtlety":"dps",
      "Elemental":"dps",
      "Enhancement":"dps",
      "Destruction":"dps",
      "Affliction":"dps",
      "Demonology":"dps",
      "Arms":"dps",
      "Fury":"dps",
      "Melee":"dps",
      "Ranged":"dps",
      "Blood":"tank",
      "Vengeance":"tank",
      "Guardian":"tank",
      "Brewmaster":"tank",
      "Protection":"tank",
      "Restoration":"healer",
      "Mistweaver":"healer",
      "Holy":"healer",
      "Discipline":"healer"
    }
    this.specs = [];
    this.icons = [];
    let i=0;
    this.rows.forEach(element => {
      this.specs.push(specList[element.class])
      if(roleCheck[element.spec] == "tank")
        this.icons.push("assets/tankIcon.png");
      else if(roleCheck[element.spec] == "healer")
        this.icons.push("assets/healerIcon.png");
      else if(roleCheck[element.spec] == "dps")
        this.icons.push("assets/dpsIcon.png");
      else
        this.icons.push("");
    });
  }
}
