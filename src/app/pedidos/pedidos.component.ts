import { Component, OnInit } from '@angular/core';
import { Http, Response, ResponseContentType} from '@angular/http'
import { AppComponent,urlConfig } from '../app.component';
import { Lanche } from '../_models/index'
@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  constructor(private appComp: AppComponent, private http: Http) { }

  showEtapa1 = true;
  showEtapa2 = false;
  listLanches;
  listIngredientes;
  mostraLanches = false;
  mostraIngredientes = false;
  selectedLanche;
  listPedidos : any[] = [];
  lanche = new Lanche;
  pedido;
  subTotal;

  ngOnInit() {
    
      this.novoPedido();
   
  }



  novoPedido(){
   
    this.showLanches();
    this.pedido = {};
    this.listPedidos = [];
    this.subTotal = 0;
    this.appComp.loadUrlServices().subscribe(result => {
      
      this.listarLanches();
      this.listarIngredientes();
    });
  }

  excluirItem(index){
    this.listPedidos.splice(index,1);
  }

  listarLanches(){
    this.http.get(urlConfig + "/lanche/list-lanches")
    .subscribe((res: Response) => {
      this.listLanches = res.json();
      console.log(this.listLanches);
     
    });
  }

  listarIngredientes(){
    this.http.get(urlConfig + "/lanche/list-ingredientes")
    .subscribe((res: Response) => {
      this.listIngredientes = res.json();
      console.log(this.listLanches);
     
    });
  }

  showLanches(){
    this.mostraLanches = true;
    this.mostraIngredientes = false;
  }

  showIngredientes(){
    this.mostraLanches = false;
    this.mostraIngredientes = true;
  }

  onLancheChange(lanche){
    this.selectedLanche = lanche;
  }

  changeCheckbox( i){
   
      this.listIngredientes[i].checked = !this.listIngredientes[i].checked;
    
  }

  adicionarPedido(){
    
    if(this.mostraLanches && this.selectedLanche != null){
    this.listPedidos.push(this.selectedLanche);
    this.subTotal = this.subTotal + this.selectedLanche.valorTotalLanche;
    }
    else{
      this.lanche = new Lanche;
      this.lanche.nome = "";

      for (let ing of this.listIngredientes) {
          if(ing.checked != undefined && ing.checked){
            this.lanche.ingredientes.push(ing);
              if(this.lanche.nome == ""){
                this.lanche.nome += ing.quantidade+"-"+ing.nome;
              }else{
                this.lanche.nome += ","+ ing.quantidade+"-"+ing.nome;;
              }
              this.subTotal = this.subTotal + (ing.preco * ing.quantidade);
          }
       }

       if(this.lanche.nome  != ""){
         this.subTotal = parseFloat( this.subTotal.toFixed(2));
        this.listPedidos.push(this.lanche);
       }
    }
}

fecharPedido(){
 
  this.pedido.lanches = this.listPedidos;
  this.http.post(urlConfig + "/pedido/save", this.pedido).map(this.extractData)
  .subscribe(suc => {
    
   this.pedido = suc;
   console.log(this.pedido);

  }, err => {
    console.log(err);
  });
}

private extractData(res: Response) {
  let body = res.json();
  return body || {};
}


}
