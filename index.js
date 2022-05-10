const params = new URLSearchParams(location.search);
new EventSource(
  `http://api.livelink.cf/stream/${params.get("channel-id")}`
).onmessage = ({ data }) => {
  data = JSON.parse(data);
  if (addMessage.lastMessageId == data.id) {
    return continueMessage(data);
  }
  addMessage(data);
};

const stream = document.getElementById("stream");
const input = document.getElementById("input");

if (params.has("no-input")) input.remove();

const addMessage = (data) => {
  addMessage.lastMessageId = data.id;
  const div = document.createElement("div");
  addMessage.lastDiv = div;
  const name = document.createElement("h3");
  name.innerHTML = data.author;
  const content = document.createElement("p");
  content.innerHTML = data.content;
  const avatar = document.createElement("img");
  avatar.src = data.avatar ?? "icon.png";
  div.append(avatar, name, content);
  stream.prepend(div);
};

const continueMessage = (data) => {
  const content = document.createElement("p");
  content.innerHTML = data.content;
  addMessage.lastDiv.append(content);
};

input.onchange = () => {
  if (!input.value) return;
  fetch(`http://api.livelink.cf/send/${params.get("channel-id")}`, {
    method: "POST",
    body: input.value,
  });
  input.value = "";
};
