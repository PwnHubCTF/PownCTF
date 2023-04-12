const forceJsonFileDownload = (data, title) => {
  if(!window) return
  const url = window.URL.createObjectURL(
    new Blob([JSON.stringify(data)], { type: "text/json" })
  );
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", title);
  document.body.appendChild(link);
  link.click();
};

export {
  forceJsonFileDownload,
};
