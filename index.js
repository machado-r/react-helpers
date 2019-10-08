import axios from 'axios';
import format from 'date-fns/format';
import locale from 'date-fns/locale/pt-BR';

export function isLastChar(index, str) {
  return index === str.length - 1;
}

export function onlyNumbers(str) {
  return str.replace(/[^\d]/g, '');
}

export function formataDataInput(value) {
  const numericData = onlyNumbers(value);
  return numericData
    .slice(0, 8)
    .split('')
    .reduce((acc, current, index) => {
      const result = `${acc}${current}`;
      if (!isLastChar(index, numericData)) {
        if ([1, 3].includes(index)) return `${result}/`;
      }
      return result;
    }, '');
}

export function formataHoraMinutoInput(value) {
  const numericData = onlyNumbers(value);
  return numericData
    .slice(0, 4)
    .split('')
    .reduce((acc, current, index) => {
      const result = `${acc}${current}`;
      if (!isLastChar(index, numericData)) {
        if ([1].includes(index)) return `${result}:`;
      }
      return result;
    }, '');
}

export function formataData(value) {
  try {
    return format(new Date(value), 'dd/MM/yyyy', { locale });
  } catch (error) {
    return '';
  }
}

export function formataHMS(value) {
  return format(new Date(value), 'hh:mm:ss', { locale });
}

export function formataHM(value) {
  return format(new Date(value), 'hh:mm', { locale });
}

export function formataDataHora(value) {
  const data = format(new Date(value), 'dd/MM/yyyy', { locale });
  const hora = format(new Date(value), 'HH:mm', { locale });
  return `${data} às ${hora}`;
}

export function formataDataHoraExtenso(data) {
  return format(new Date(data), `E, dd 'de' MMM 'às' HH:mm`, { locale });
}

export function formataHora(value) {
  const numericData = onlyNumbers(value);
  return numericData
    .slice(0, 5)
    .split('')
    .reduce((acc, current, index) => {
      const result = `${acc}${current}`;
      if (!isLastChar(index, numericData)) {
        if ([1].includes(index)) return `${result}:`;
      }
      return result;
    }, '');
}

export function formataValor(value, max) {
  const numericData = onlyNumbers(value).slice(0, max);
  const len = numericData.length;
  if (len >= 3) {
    const part1 = numericData.slice(0, len - 2);
    const part2 = numericData.slice(len - 2, len);
    return `${part1}.${part2}`.replace(',', '.');
  }
  return numericData;
}

export function formataCelular(value) {
  try {
    const numericData = onlyNumbers(value);
    if (value.includes('+')) {
      // número internacionais
      return value.replace(/(^\+)+[^\d^(^)^ ^\-^]/g, '').slice(0, 22);
    }
    // números brasileiros
    return numericData
      .slice(0, 11)
      .split('')
      .reduce((acc, current, index) => {
        const result = `${acc}${current}`;

        if (!isLastChar(index, numericData)) {
          if ([0].includes(index)) return `(${result}`;
          if ([1].includes(index)) return `${result}) `;
          if ([5].includes(index)) return `${result}-`;
        }
        return result;
      }, '');
  } catch (error) {
    return null;
  }
}

export function formataCep(value) {
  const numericData = onlyNumbers(value);
  return numericData
    .slice(0, 8)
    .split('')
    .reduce((acc, current, index) => {
      const result = `${acc}${current}`;
      if (!isLastChar(index, numericData)) {
        if ([4].includes(index)) return `${result}-`;
      }
      return result;
    }, '');
}

export async function consultaCep(cep) {
  try {
    const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//verifica se a propriedade existe no objeto, evita erros
export const checkProp = (obj, prop) => (obj && prop in obj ? obj[prop] : '');

// verifica e retorna propriedades em objetos complexos
export const getSafe = (object, path, defaultValue = '') => {
  const res = path
    .split('.')
    .reduce((o, p) => (o ? o[p] : defaultValue), object);
  if (res === undefined) {
    return defaultValue;
  }
  return res;
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const checkHTTP = (link) => {
  if (link.includes('http://') || link.includes('https://')) {
    return link;
  } else {
    return `http://${link}`;
  }
};

export const checkWhatsApp = (number) => {
  const whats = onlyNumbers(number);
  if (whats.length === 11) {
    return `55${whats}`;
  } else {
    return whats;
  }
};

// otimização de performance nos forms
export function propsAreEqual(prev, next) {
  const pValue = getSafe(prev.formik.values, prev.field);
  const nValue = getSafe(next.formik.values, next.field);
  if (pValue !== nValue) return false;

  const pTouched = getSafe(prev.formik.touched, prev.field, false);
  const nTouched = getSafe(next.formik.touched, next.field, false);
  if (pTouched !== nTouched) return false;

  const pError = getSafe(prev.formik.errors, prev.field, false);
  const nError = getSafe(next.formik.errors, next.field, false);
  if (pError !== nError) return false;

  // verificação adicional para selects
  if (prev.options && next.options) {
    if (prev.options !== next.options) return false;
  }

  return true;
}

export const flattenObject = (obj) => {
  const flattened = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]));
    } else {
      flattened[key] = obj[key];
    }
  });
  return flattened;
};

export function filterData(term, data) {
  return data.filter((obj) => {
    const flat = flattenObject(obj);
    return Object.values(flat).some((val) =>
      val
        ? val
            .toString()
            .toLowerCase()
            .includes(term.toLowerCase())
        : false
    );
  });
}

// formata cartao
export function formataCartaoInput(value) {
  const numericData = onlyNumbers(value);
  return numericData
    .slice(0, 16)
    .split('')
    .reduce((acc, current, index) => {
      const result = `${acc}${current}`;
      if (!isLastChar(index, numericData)) {
        if ([3, 7, 11].includes(index)) return `${result} `;
      }
      return result;
    }, '');
}
