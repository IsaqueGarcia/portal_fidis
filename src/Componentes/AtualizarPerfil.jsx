import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import axios from 'axios';

export default class AtualizarPerfil extends React.Component {
    state = {
        nomePerfil: this.props.location.state.nomePerfil,
        perfil:[],
        permissoes: [],
        listaPermissoes:[],
        contador: 1,
        listaRemoverPermissao: []
    }

    async componentDidMount() {
        const response = axios.get(window.env.API_PA + '/v0/portal/permissoes');
        this.setState({ permissoes: (await response).data.permissoes })

        const respostaPerfil = axios.get(window.env.API_PA + '/v0/portal/perfil',{headers:{tipoPerfil:this.state.nomePerfil}});
        this.setState({ perfil: (await respostaPerfil).data.permissoes})
    }

    selecionarPermissao(id) {
        const selecionado = document.getElementById(id)
        selecionado.classList.toggle('perfilSelecionado');
        const nomePermissao = document.getElementById(id).innerText
        if (this.state.listaRemoverPermissao.includes(nomePermissao) === false) {
            this.state.listaRemoverPermissao.push(nomePermissao)
        }
    }

    adicionarPermissao() {
        const select = document.getElementById('selecionarAttPerfil').value
        const i = this.state.contador
        const divId = `divId[${i}]`
        if (this.state.listaPermissoes.includes(select) === false) {
            this.state.listaPermissoes.push(select)
            const caixaAdicionar = document.getElementById('caixaAdicionar')
            const div = document.createElement('div')
            div.className = 'perfis';
            div.id = divId
            div.onclick = () => { this.selecionarPermissao(divId) }
            const h4 = document.createElement('h4')
            h4.className = 'perfisLabel';
            const nomePerfil = document.createTextNode(select)
            div.appendChild(h4)
            h4.appendChild(nomePerfil)
            caixaAdicionar.appendChild(div)
            this.setState({ contador: i + 1 })
        }
    }


    adicionarNovaPermissao(state) {
        console.log(state.listaPermissoes)
            axios.post(window.env.API_PA + '/v0/portal/perfil/permissao', {
                tipoPerfil: state.nomePerfil,
                listaPermissao: state.listaPermissoes
            })
                .then(response => {
                    if(response.status == 200){
                        window.location.reload(true);
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }

    
    adicionarTodas(){
        const comboPermissoes = document.getElementById('selecionarAttPerfil');
        for(let i = 0; i < comboPermissoes.length; i++ ){
            const divId = `divId[${i}]`
        if (this.state.listaPermissoes.includes(comboPermissoes[i].value) === false) {
            this.state.listaPermissoes.push(comboPermissoes[i].value)
            const caixaAdicionar = document.getElementById('caixaAdicionar')
            const div = document.createElement('div')
            div.className = 'perfis';
            div.id = divId
            div.onclick = () => { this.selecionarPermissao(divId) }
            const h4 = document.createElement('h4')
            h4.className = 'perfisLabel';
            const nomePerfil = document.createTextNode(comboPermissoes[i].value)
            div.appendChild(h4)
            h4.appendChild(nomePerfil)
            caixaAdicionar.appendChild(div)
        }
        }

    }

    removerPermissao(permissao) {
        const permissaoId = document.getElementById(permissao)
        axios.delete(window.env.API_PA + '/v0/portal/perfil/permissao', {
            data: {
                tipoPerfil: this.state.nomePerfil,
                codigoPermissao: permissao
            }
        })
            .then(response => {
                if (response.status == 200) {
                    permissaoId.remove()
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    remover(callback) {
        try {
            const divPai = document.getElementById('caixaAdicionar')

            for (var i = 0; i < divPai.children.length; i++) {
                if (divPai.children[i].classList.contains('perfilSelecionado') === true) {
                    divPai.children[i].remove();
                    i--
                }
            }
        }
        catch (e) {
            console.log('Error:: linha 80 - RemoverPermissao' + e);
        }

        if (callback) {
            callback()
        }

    }

    removerPermissaoLista() {
        for (const arr of [this.state.listaPermissoes]) {
            const interseccao = this.state.listaRemoverPermissao.filter(x => {
                if (arr.includes(x)) {
                    var index = arr.indexOf(x);
                    if (index >= 0) {
                        arr.splice(index, 1)
                    }
                }
            })
        }
        this.setState({ listaRemoverPermissao: [] })
    }

    gravarLog(atividade) {
        axios.post(window.env.API_PA + '/v0/portal/log', {
            usuario: sessionStorage.getItem('userToken'),
            atividade: atividade
        })
            .then((response) => {
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    
    render() {
        const { permissoes, nomePerfil,perfil } = this.state
        return (
            <div className="fundo">
                <Header opcao="Voltar" />
                <div id="atualizarPerfilContainer">
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <div id="adicionarRemoverPerfil">
                        <div className="headerForm"><h2>Atualizar perfil</h2></div>
                        <div id="adicionarPerfil">
                            <p>&nbsp;</p>
                            <label id="tituloDoPerfil"><h4>Nome do perfil</h4></label>
                            <label id="nomePerfil"><h5>{nomePerfil}</h5></label>
                            <label id="labelPermissao">Selecione as permissões:</label>
                            <select id="selecionarAttPerfil">
                                {permissoes.map(
                                    permissao => (
                                        <option>{permissao.codigoPermissao}</option>
                                    )
                                )}
                            </select>
                            <div id="setas">
                                <div id="setaBaixo" onClick={e => this.adicionarPermissao()}><i class="fas fa-arrow-down fa-lg" ></i></div>
                                <div id="setaCima" onClick={e => this.remover(this.removerPermissaoLista())}><i class="fas fa-arrow-up fa-lg"></i></div>
                                <button className="botaoAdicionarTudo" onClick={e => this.adicionarTodas()}><p>Adicionar tudo</p></button>
                            </div>
                            <div id="caixaAdicionar">
                            
                            </div>
                            <button id="btnAdicionarPermissoes" onClick={e => this.adicionarNovaPermissao(this.state)}>Adicionar</button>
                        </div>
                        <div id="removerPerfil">
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <label id="tituloRemoverPermissao"><h4>Remover permissão</h4></label>
                            <div id="caixaRemover">
                            {/* this.state.perfil.permissoes */}
                                {perfil.map(
                                    perfil => (
                                        <div className="permissoesDelete" id={perfil.codigoPermissao} ><p className="caixaNomePermissao">{perfil.codigoPermissao}</p><button onClick={e => this.removerPermissao(perfil.codigoPermissao)} className="btnPermissaoDeletar">DELETAR</button></div>
                                    )
                                )} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}