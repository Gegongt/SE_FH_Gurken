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

                        <a id = "profileLink" class = "ms-2" href = "#">Profile</a>
                    </apan>

                    <a id = "logoutLink" href = "#">Logout</a>
                </div>
            </nav>`;
    }

    private bindLink(id:string, address:string|null, callback:() => void = () => {}):void
    {
        let linkElement:HTMLLinkElement = document.getElementById(id) as HTMLLinkElement;
        
        if(address)
        {
            linkElement.href = address;
        }

        else
        {
            linkElement.addEventListener("click", () =>
            {
                callback();
            });
        }
    }

    bindLogoLink(address:string):void
    {
        this.bindLink("logoLink", address);
    }

    bindProfileLink(address:string):void
    {
        this.bindLink("profileLink", address);
    }

    bindHomeLink(address:string):void
    {
        this.bindLink("homeLink", address);
    }

    bindLogoutLink(callback:() => void):void
    {
        this.bindLink("logoutLink", null, () => callback());
    }
}
