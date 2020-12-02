import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header'
import "./css/style.css"
import axios from 'axios'

export default class AtualizarUsuario extends React.Component {

    state = {
        perfis: [],
        listaPerfis: [],
        removerPerfil: [],
        contador: 1,
        numeroDocumento: this.props.location.state.numeroDocumento,
        email: "",
        ddd: "",
        ddi: "",
        numeroCelular: "",
        nomeUsuario: "",
        usuario: [],
        mensagemRetorno: ""
    }

    async componentDidMount() {
        const response = axios.get(window.env.API_PA +'/v0/portal/perfis');
        this.setState({ perfis: (await response).data.perfis })

        axios.get(window.env.API_PA + '/v0/portal/usuario', {
            headers: {
                numeroDocumento: this.state.numeroDocumento
            }
        }).then(response => {
            this.setState({ usuario: response.data })
            if (response.status == 200) {
                this.setState({
                    numeroCelular: this.state.usuario.numeroCelular,
                    nomeUsuario: this.state.usuario.nomeUsuario,
                    email: this.state.usuario.email,
                    ddd: this.state.usuario.ddd,
                    ddi: this.state.usuario.ddi
                })
                this.carregarPerfil();
            }
        })


    }

    mostraMensagem() {
        try {
            setTimeout(() => {
                if (this.state.mensagemRetorno == "Usuário atualizado com sucesso!") {
                    document.getElementById('labelRetorno').style.color = "green"
                } else {
                    document.getElementById('labelRetorno').style.color = "red"
                }
                var mensagemRetornoAtualizarUsuario = document.getElementById('mensagemRetornoAtualizarUsuario')

                mensagemRetornoAtualizarUsuario.style.display = 'block'
                setTimeout(() => {
                    mensagemRetornoAtualizarUsuario.style.display = 'none'
                    this.setState({ mensagemRetorno: "" })
                }, 1000)
            }, 500)
        } catch (e) {
            console.log(e)
        }
    }


    carregarPerfil() {
        const listaPerfil = this.state.usuario.perfis
        for (let i = 0; i < listaPerfil.length; i++) {
            const divId = `divId[${i}]`
            if (this.state.listaPerfis.includes(listaPerfil[i].perfil) === false) {
                this.state.listaPerfis.push(listaPerfil[i].perfil)
                const caixaPerfil = document.getElementById('perfisSelecionados')
                const div = document.createElement('div')
                div.className = 'perfis';
                div.id = divId
                div.onclick = () => { this.selecionarPerfil(divId) }
                const h4 = document.createElement('h4')
                h4.className = 'perfisLabel';
                const nomePerfil = document.createTextNode(listaPerfil[i].perfil)
                div.appendChild(h4)
                h4.appendChild(nomePerfil)
                caixaPerfil.appendChild(div)
            }
        }
    }

    atualizaUsuario(state) {
        axios.patch(window.env.API_PA + '/v0/portal/usuario/' + `${state.numeroDocumento}`, {
            nomeUsuario: state.nomeUsuario,
            email: state.email,
            numCelular: state.numCelular,
            ddd: state.ddd,
            ddi: state.ddi,
            listaPerfis: state.listaPerfis
        })
            .then((response) => {
                if (response.status == 200) {
                    this.setState({ mensagemRetorno: "Usuário atualizado com sucesso!" })
                    this.mostraMensagem();
                    this.gravarLog('USUARIO ATUALIZADO, NOME_USUARIO:: ' + state.nomeUsuario + ', NUMERO_DOCUMENTO:: ' + state.numeroDocumento)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }


    setNomeUsuario(e) {
        this.setState({ nomeUsuario: e.target.value })
    }
    setEmail(e) {
        this.setState({ email: e.target.value })
    }
    setNumCelular(e) {
        if (this.state.numeroCelular.length == 8) {
            e.preventDefault();
        }

        this.setState({ numeroCelular: e.target.value })
    }
    setDDD(e) {
        this.setState({ ddd: e.target.value })
    }
    setDDI(e) {
        this.setState({ ddi: e.target.value })
    }

    pegarPerfil() {
        const select = document.getElementById('listaPerfil')
    }

    selecionarPerfil(id) {
        const selecionado = document.getElementById(id)
        selecionado.classList.toggle('perfilSelecionado');
        const nomeDoPerfil = document.getElementById(id).innerText
        if (this.state.removerPerfil.includes(nomeDoPerfil) === false) {
            this.state.removerPerfil.push(nomeDoPerfil)
        }
    }

    removerPerfil(callback) {
        try {
            const divPai = document.getElementById('perfisSelecionados')

            for (var i = 0; i < divPai.children.length; i++) {
                if (divPai.children[i].classList.contains('perfilSelecionado') === true) {
                    divPai.children[i].classList.add('displayNone')
                }
            }
        }
        catch (e) {
            console.log('Error:: linha 33 - CriarUsuario' + e);
        }

        if (callback) {
            callback()
        }

    }

    removerPerfilArray() {
        for (const arr of [this.state.listaPerfis]) {
            const interseccao = this.state.removerPerfil.filter(x => {
                if (arr.includes(x)) {
                    var index = arr.indexOf(x);
                    if (index >= 0) {
                        arr.splice(index, 1)
                    }
                }
            })
        }
        this.setState({ removerPerfil: [] })
    }

    adicionarPerfil() {
        const select = document.getElementById('listaPerfil').value
        const i = this.state.contador
        const divId = `divId[${i}]`
        if (this.state.listaPerfis.includes(select) === false) {
            this.state.listaPerfis.push(select)
            const caixaPerfil = document.getElementById('perfisSelecionados')
            const div = document.createElement('div')
            div.className = 'perfis';
            div.id = divId
            div.onclick = () => { this.selecionarPerfil(divId) }
            const h4 = document.createElement('h4')
            h4.className = 'perfisLabel';
            const nomePerfil = document.createTextNode(select)
            div.appendChild(h4)
            h4.appendChild(nomePerfil)
            caixaPerfil.appendChild(div)
            this.setState({ contador: i + 1 })
        }
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
        const { perfis, email, ddd, ddi, numeroCelular, nomeUsuario, mensagemRetorno } = this.state
        return (
            <div className="fundo">
                <Header opcao="Voltar" />
                <div className="container">
                    <div id="mensagemRetornoAtualizarUsuario"><h6 id="labelRetorno"><i class="fas fa-envelope"></i>&nbsp;{mensagemRetorno}</h6></div>
                    <div className="atualizarUsuario">
                        <div className="tituloCriarUsuario"><h3>Informações do usuário</h3></div>
                        <div className="formatacaoTela">
                            <input id="usuarioNome" className="inputUsuario" maxLength="45" type="text" value={nomeUsuario} onChange={e => this.setNomeUsuario(e)} placeholder="Nome usuário"></input>
                            <input id="emailUsuario" className="inputUsuario" maxLength="45" type="text" value={email} onChange={e => this.setEmail(e)} placeholder="Email"></input>
                            <div className="campoDDDeDDI">
                                <input id="ddiUsuario" className="ddi" type="number" value={ddi} onChange={e => this.setDDI(e)} placeholder="DDI" ></input>
                                <input id="dddUsuario" className="ddd" type="number" value={ddd} onChange={e => this.setDDD(e)} placeholder="DDD" ></input>
                                <input id="numeroCelular" className="numeroCelular" type="number" value={numeroCelular} onChange={e => this.setNumCelular(e)} placeholder="Num.Celular"></input>
                            </div>
                            <button className="btnPadrao" onClick={e => this.atualizaUsuario(this.state)}>Atualizar</button>
                        </div>
                    </div>
                    <div className="informacaoPerfil">
                        <div className="tituloCriarUsuario"><h3>Perfil de acesso</h3></div>
                        <select id="listaPerfil" onChange={e => this.pegarPerfil()}>
                            {perfis.map(perfis => (<option value={perfis.perfil}>{perfis.perfil}</option>))}
                        </select>
                        <span onClick={e => this.adicionarPerfil()} className="arrowDown"><i class="fas fa-arrow-down fa-lg"></i></span>
                        <span onClick={e => this.removerPerfil(this.removerPerfilArray())} className="arrowUp"><i class="fas fa-arrow-up fa-lg"></i></span>
                        <div id="perfisSelecionados" className="caixaPerfil"> </div>
                    </div>
                </div>
            </div>
        )
    }
}