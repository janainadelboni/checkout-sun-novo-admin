export function EduzzLogo() {
  return (
    <span
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '22px',
        fontWeight: 800,
        color: '#1a1a2e',
        letterSpacing: '-0.5px',
      }}
    >
      eduzz
    </span>
  )
}

export function CheckoutSunLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FAAD14, #FFC53D)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#fff',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          color: '#1a1a2e',
        }}
      >
        Checkout Sun
      </span>
    </div>
  )
}
