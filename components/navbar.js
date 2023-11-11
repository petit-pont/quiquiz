class Navbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                nav {
                    height: var(--navbar-height);
                    background-color: #0a0a23;
                    border-bottom: 1px solid black;
                }

                nav ul {
                    display: flex;
                }
                
                nav * {
                    height: 100%;
                }
                
                nav a {
                    color:rgb(233, 233, 233);
                    align-self: center;
                    display: flex;
                    align-items: center;
                    padding: 0 0.75rem;
                    text-decoration: none;
                }

                .spacer {
                    flex-grow: 1;
                }
                
                #quiquiz {
                    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                </style>

            <nav>
                <ul>
                    <li><a id="quiquiz" href="../index.html">Quiquiz</a></li>
                    <li class="spacer"></li>
                    <li><a href="../about.html">À propos</a></li>
                </ul>
            </nav>
        `;
    }
}


customElements.define('navbar-component', Navbar);