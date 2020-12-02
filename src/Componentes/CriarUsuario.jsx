import React, { createElement } from 'react'
import ReactDOM from 'react-dom'
import Header from './Header'
import './css/style.css'
import axios from 'axios'

export default class CriarUsuario extends React.Component {

    state = {
        perfis: [],
        listaPerfis: [],
        removerPerfil: [],
        contador: 1,
        login: "",
        nomeUsuario: "",
        numeroDocumento: "",
        email: "",
        numCelular: "",
        ddd: "",
        ddi: "",
        mensagemRetorno: ""
    }

    mostraMensagem() {
        try {
            setTimeout(() => {
                if (this.state.mensagemRetorno == "Usuário criado com sucesso!") {
                    document.getElementById('labelRetorno').style.color = "green"
                } else {
                    document.getElementById('labelRetorno').style.color = "red"
                }
                var mensagemRetorno = document.getElementById('mensagemRetorno')

                mensagemRetorno.style.display = 'block'
                if (mensagemRetorno != null) {
                    setTimeout(() => {
                        mensagemRetorno.style.display = 'none'
                        this.setState({ mensagemRetorno: "" })
                    }, 1000)
                }
            }, 500)
        } catch (e) {
            console.log(e)
        }
    }

    limpaCampo() {
        document.getElementById('loginUsuario').value = "";
        document.getElementById('usuarioNome').value = "";
        document.getElementById('emailUsuario').value = "";
        document.getElementById('ddiUsuario').value = "";
        document.getElementById('dddUsuario').value = "";
        document.getElementById('numeroCelular').value = "";
        document.getElementById('documentoUsuario').value = "";
        this.setState({ login: "", nomeUsuario: "", numeroDocumento: "", email: "", numCelular: "", ddd: "", ddi: "" })
    }

    cadastrarUsuario(state) {
        if (state.login == "") {
            this.setState({ mensagemRetorno: "O campo login precisa ser preenchido!" })
            this.mostraMensagem();
        }
        if (state.nomeUsuario == "") {
            this.setState({ mensagemRetorno: "O Nome do usuário é obrigatorio!" })
            this.mostraMensagem();
        }
        if (state.numeroDocumento == "") {
            this.setState({ mensagemRetorno: "O campo numero do documento precisa ser preenchido!" })
            this.mostraMensagem();
        }
        if (state.ddd == "" || state.ddi == "" || state.numCelular == "") {
            this.setState({ mensagemRetorno: "As informações para contato são obrigatorias!" })
            this.mostraMensagem();
        }
        if (state.listaPerfis == [] || state.listaPerfis == "") {
            this.setState({ mensagemRetorno: "O usuário deve conter ao menos um perfil!" })
            this.mostraMensagem();
        }
        if (state.email == "") {
            this.setState({ mensagemRetorno: "O campo email precisa ser preenchido!" })
            this.mostraMensagem();
        }
        axios.post(window.env.API_PA + "/v0/portal/usuario", {
            login: state.login,
            nomeUsuario: state.nomeUsuario,
            numeroDocumento: state.numeroDocumento,
            email: state.email,
            numCelular: state.numCelular,
            ddd: state.ddd,
            ddi: state.ddi,
            listaPerfis: state.listaPerfis
        })
            .then((response) => {
                if (response.status == 201) {
                    this.setState({ mensagemRetorno: "Usuário criado com sucesso!" });
                    this.mostraMensagem();
                    this.limpaCampo();
                    this.gravarLog('USUÁRIO CRIADO, NOME:: ' + state.nomeUsuario + " NUMERO_DOCUMENTO :: " + state.numeroDocumento);
                }
            }).catch(function (error) {
                console.log(error)
            })
    }

    setLogin(e) {
        this.setState({ login: e.target.value })

    }
    setNomeUsuario(e) {
        this.setState({ nomeUsuario: e.target.value })
    }
    setNumeroDocumento(e) {
        this.setState({ numeroDocumento: e.target.value })
    }
    setEmail(e) {
        this.setState({ email: e.target.value })
    }
    setNumCelular(e) {
        this.setState({ numCelular: e.target.value })
    }
    setDDD(e) {
        this.setState({ ddd: e.target.value })
    }
    setDDI(e) {
        this.setState({ ddi: e.target.value })
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

    async componentDidMount() {
        const response = axios.get(window.env.API_PA + '/v0/portal/perfis');
        this.setState({ perfis: (await response).data.perfis })
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
        const { perfis, login, nomeUsuario, numeroDocumento, ddd, ddi, numCelular, email, mensagemRetorno } = this.state
        return (
            <div className="fundo">
                <Header opcao="Voltar"></Header>
                <div className="containerNovoUsuario">
                    <div id="mensagemRetorno"><h6 id="labelRetorno"><i class="fas fa-envelope"></i>&nbsp;{mensagemRetorno}</h6></div>
                    <div className="informacaoUsuario">
                        <div className="tituloCriarUsuario"><h3>Informações do usuário</h3></div>
                        <div className="formatacaoTela">
                            <input id="loginUsuario" className="inputUsuario" type="text" value={login} maxLength="20" onChange={e => this.setLogin(e)} placeholder="Login"></input>
                            <input id="usuarioNome" className="inputUsuario" type="text" value={nomeUsuario} maxLength="45" onChange={e => this.setNomeUsuario(e)} placeholder="Nome usuário"></input>
                            <input id="emailUsuario" className="inputUsuario" type="text" placeholder="Email" maxLength="45" value={email} onChange={e => this.setEmail(e)}></input>
                            <div className="campoDDDeDDI">
                                <input id="ddiUsuario" className="ddi" type="number" placeholder="DDI" value={ddi} onChange={e => this.setDDI(e)}></input>
                                <input id="dddUsuario" className="ddd" type="number" placeholder="DDD" value={ddd} onChange={e => this.setDDD(e)}></input>
                                <input id="numeroCelular" className="numeroCelular" type="number" placeholder="Num.Celular" value={numCelular} onChange={e => this.setNumCelular(e)}></input>
                            </div>
                            <input id="documentoUsuario" className="inputUsuario" type="number" value={numeroDocumento} placeholder="Número do documento" onChange={e => this.setNumeroDocumento(e)}></input>
                            <button className="btnPadrao" onClick={e => this.cadastrarUsuario(this.state)}>Criar</button>
                        </div>
                    </div>
                    <div className="informacaoPerfil">
                        <div className="tituloCriarUsuario"><h3>Perfil de acesso</h3></div>
                        <select id="listaPerfil">
                            {perfis.map(perfis => (<option value={perfis.perfil}>{perfis.perfil}</option>))}
                        </select>
                        <span onClick={e => this.adicionarPerfil()} className="arrowDown"><i class="fas fa-arrow-down fa-lg" ></i></span>
                        <span onClick={e => this.removerPerfil(this.removerPerfilArray())} className="arrowUp"><i class="fas fa-arrow-up fa-lg"></i></span>
                        <div id="perfisSelecionados" className="caixaPerfil"> </div>
                    </div>
                </div>
            </div>
        )
    }
}