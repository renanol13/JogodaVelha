//CSS dos elementos

const styleDivBackground = {
  position: "fixed",
  top: "0",
  left: "0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100dvh",
  width: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.59)",
  zIndex: "999",
};

const styleDivMsgAlert = {
  backgroundColor: "#2c3e50",
  borderRadius: "10px",
  height: "100px",
  width: "70%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  fontSize: "1.2rem",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.299)",
};

const styleContent = {
  fontWeight: "bold",
  marginBlock: "10px",
  fontFamily: "arial",
  color: "#d1d4dc",
  textAlign: "center",
};

const styleButton = {
  width: "70%",
  cursor: "pointer",
  backgroundColor: "transparent",
  border: "1px solid #d1d4dc",
  borderRadius: "10px",
  paddingBlock: "4px",
  color: "#d1d4dc",
  margin: "5px",
};

const styleLoading = {
  marginBottom: "10px",
  fontFamily: "arial",
  color: "#d1d4dc",
  textAlign: "center",
  fontSize: ".8rem",
};

const showMessage = ({
  contentMsg,
  contentLoading = false,
  handleClick = false,
  contentButton = false,
}) => {
  const divBackground = document.createElement("div");
  divBackground.setAttribute("id", "divBackground");
  Object.assign(divBackground.style, styleDivBackground);

  const divMsgAlert = document.createElement("div");
  Object.assign(divMsgAlert.style, styleDivMsgAlert);

  divMsgAlert.innerHTML = `
        <div id="boxMsgAlert">
            <p id="content">${contentMsg}</p>
            ${contentLoading ? `<p id='loading'>${contentLoading}</p>` : ""}
            <div style="display:flex; justify-content:center;">
                ${
                  !contentButton
                    ? "<button>OK</button>"
                    : `<button>${
                        contentButton ? contentButton : "Cancelar"
                      }</button>`
                }
            </div>
        </div>`;

  const p = divMsgAlert.querySelector("#content");
  Object.assign(p.style, styleContent);

  if (contentLoading) {
    const loading = divMsgAlert.querySelector("#loading");
    Object.assign(loading.style, styleLoading);
  }

  const button = divMsgAlert.querySelector("button");
  Object.assign(button.style, styleButton);

  button.addEventListener(
    "click",
    () => {
      if (handleClick) handleClick();
      closeMessage();
    },
    { once: true }
  );

  divBackground.appendChild(divMsgAlert);
  document.body.appendChild(divBackground);
};

const closeMessage = () => {
  document.body.removeChild(document.body.querySelector("#divBackground"));
};

export { showMessage, closeMessage };
