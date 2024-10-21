export const Charts = ({ data }) => {
  return (
    <div className="space-y-2">
      {data.ids.map((item, index) => (
        <h1 key={index} className="rounded-md bg-red-50">
          {item}
        </h1>
      ))}
    </div>
  );
};
