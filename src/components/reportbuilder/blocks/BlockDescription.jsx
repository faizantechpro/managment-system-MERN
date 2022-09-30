const BlockDescription = ({ texts }) => {
  return (
    <>
      {texts.map((text, index) => (
        <p className="mb-2 font-size-sm2 font-weight-medium" key={index}>
          {text}
        </p>
      ))}
    </>
  );
};

export default BlockDescription;
