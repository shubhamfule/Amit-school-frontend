export default function Widget({ icon, title, items, renderItem, emptyLabel = "Nothing to show right now." }) {
  return (
    <div className="widget-card">
      <h4><i className={icon}></i>{title}</h4>
      {items.length === 0 ? (
        <div className="widget-empty">{emptyLabel}</div>
      ) : (
        <ul className="widget-list">
          {items.map((item, i) => (
            <li key={item.id ?? i}>{renderItem(item)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
