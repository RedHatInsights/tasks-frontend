export const linkAndDownload = (data, filename) => {
  const link = document.createElement('a');
  link.href = data;
  link.download = filename;
  link.click();
};
