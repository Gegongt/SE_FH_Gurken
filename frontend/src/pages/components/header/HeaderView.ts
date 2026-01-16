export class HeaderView
{
    render(parentElementId:string):void
    {
        let parentElement = document.getElementById(parentElementId);

        parentElement!.classList.add("headerElement", "p-1");
        parentElement!.innerHTML = `
            <nav class = "navbar">
                <div class = "container-fluid">
                    <apan>
                        <a id = "logoLink" class = "navbar-brand" href = "#">
                            <img src = "../../../../images/logo.png" alt="Logo" width="50" height="34" class="d-inline-block align-text-top">
                        </a>

                        <a id = "homeLink" href = "#">Home</a>
                    </apan>

                    <a id = "logoutLink" href = "#">Logout</a>
                </div>
            </nav>`;
    }

    private bindLink(id:string, address:string):void
    {
        let linkElement:HTMLLinkElement = document.getElementById(id) as HTMLLinkElement;
        linkElement.href = address;
    }

    bindLogoLink(address:string):void
    {
        this.bindLink("logoLink", address);
    }

    bindHomeLink(address:string):void
    {
        this.bindLink("homeLink", address);
    }

    bindLogoutLink(address:string):void
    {
        this.bindLink("logoutLink", address);
    }
}
